from .celery_app import app
from .image_ops import create_variants
from .s3 import download_image, upload_processed_image
import psycopg2
from config import PG_USERNAME, PG_PASSWORD, PG_DATABASE, PG_HOST

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

        print(f"Imag e downloaded! Extension: {extension}")

        variants = create_variants(image_data)  
        urls = {}
        for variant_type, img_data in variants.items():
            print("Creating a variant!")
            key = f"uploads/comics/public/{comic_id}/pages/{page_number}-{variant_type}{extension}"
            url = upload_processed_image(img_data, key)
            urls[f"{variant_type}_url"] = url
        
        # Update database
        update_database(page_id, urls)
        return urls
        
    except Exception as exc:
        self.retry(exc=exc, countdown=2 ** self.request.retries)

def update_database(page_id: int, urls: dict):
    connection_string = f"postgresql://{PG_USERNAME}:{PG_PASSWORD}@{PG_HOST}:5432/{PG_DATABASE}"
    conn = psycopg2.connect(connection_string)
    cur = conn.cursor()
    
    try:
        cur.execute("""
            UPDATE comic_pages 
            SET 
                thumbnail_image_url = %(thumbnail_url)s,
                low_res_image_url = %(low_res_url)s,
                processed = TRUE
            WHERE id = %(page_id)s
        """, {
            "thumbnail_url": urls["thumbnail_url"],
            "low_res_url": urls["low_res_url"],
            "page_id": page_id
        })
        conn.commit()
    finally:
        cur.close()
        conn.close()