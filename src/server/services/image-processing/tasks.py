from celery import Celery
from .image_ops import create_variants
from .s3 import download_image, upload_processed_image
import psycopg2
from config import REDIS_URL

app = Celery('image_processor', broker=REDIS_URL)

@app.task(bind=True, max_retries=3)
def process_comic_image(self, page_id: int, original_url: str, comic_id: int, page_number: int):
    try:
        image_data, content_type = download_image(original_url)

        mime_to_ext = {
            'image/jpeg': '.jpg',
            'image/png': '.png',
            'image/gif': '.gif',
            'image/webp': '.webp'
        }
        extension = mime_to_ext.get(content_type, '.jpg')

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
    conn = psycopg2.connect("Connected to database")
    cur = conn.cursor()
    
    try:
        cur.execute("""
            UPDATE comic_pages 
            SET 
                thumbnail_image_url = %(thumbnail_url)s,
                low_res_image_url = %(lores_url)s,
                processing_status = TRUE
            WHERE id = %(page_id)s
        """, {**urls, "page_id": page_id})
        conn.commit()
    finally:
        cur.close()
        conn.close()