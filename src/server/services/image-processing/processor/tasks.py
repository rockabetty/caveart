from .celery_app import app
from .image_ops import create_variants
from .s3 import download_image, upload_processed_image
import psycopg2
from sqlalchemy import create_engine, URL
from sqlalchemy.orm import Session
from config import PG_USERNAME, PG_PASSWORD, PG_DATABASE, PG_HOST, PG_PORT, NODE_ENV

url_object = URL.create(
    "postgresql+psycopg2",
    username=PG_USERNAME,
    password=PG_PASSWORD,
    host=PG_HOST,
    port=PG_PORT,
    database=PG_DATABASE,
)

engine = create_engine(url_object, echo=True if NODE_ENV == "development" else False)

@app.task(bind=True, max_retries=3)
def process_comic_image(self, page_id: int, original_url: str, comic_id: int, page_number: int):
    print(f"Processing image from: {original_url}")
   
    try:
        image_data, content_type = download_image(original_url)

        mime_to_ext = {
            'image/jpeg': '.jpg',
            'image/png': '.png',
            'image/gif': '.gif',
            'image/webp': '.webp'
        }
        extension = mime_to_ext.get(content_type, '.jpg')

        print(f"Image downloaded! Extension: {extension}")

        variants = create_variants(image_data)  
        urls = {}
        for variant_type, img_data in variants.items():
            key = f"uploads/comics/public/{comic_id}/pages/{page_number}-{variant_type}{extension}"
            url = upload_processed_image(img_data, key)
            urls[f"{variant_type}_url"] = url
        
        # Update database
        update_database(page_id, urls)
        return urls
        
    except Exception as exc:
        self.retry(exc=exc, countdown=2 ** self.request.retries)

def update_database(page_id: int, urls: dict):
    query = text(("UPDATE comic_pages "
                 "SET thumbnail_image_url = :thumbnail_url, "
                 "    low_res_image_url = :low_res_url, "
                 "    processed = TRUE "
                 "WHERE id = :page_id;"))
    
    values = {
        "thumbnail_url": urls["thumbnail_url"],
        "low_res_url": urls["low_res_url"],
        "page_id": page_id
    }

    with Session(engine) as session:
        result = session.execute(query, values)