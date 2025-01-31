from .celery_app import app
from .image_ops import create_variants
from .s3 import download_image, upload_processed_image
import psycopg2

@app.task(bind=True, max_retries=3)
def process_comic_image(self, page_id: int, original_url: str, comic_id: int, page_number: int):
    print(f"Processing image from: {original_url}")
    return f"Image processed: {original_url}"

    # print(f"Starting to process image: page_id={page_id}, comic_id={comic_id}")  # Debug log
    # try:
    #     image_data, content_type = download_image(original_url)

    #     mime_to_ext = {
    #         'image/jpeg': '.jpg',
    #         'image/png': '.png',
    #         'image/gif': '.gif',
    #         'image/webp': '.webp'
    #     }
    #     extension = mime_to_ext.get(content_type, '.jpg')

    #     printf(f"Imag e downloaded! Extension: {extension}")

    #     variants = create_variants(image_data)  
    #     urls = {}
    #     for variant_type, img_data in variants.items():
    #         pritnf("Creating a variant!")
    #         key = f"uploads/comics/public/{comic_id}/pages/{page_number}-{variant_type}{extension}"
    #         url = upload_processed_image(img_data, key)
    #         urls[f"{variant_type}_url"] = url
        
    #     # Update database
    #     update_database(page_id, urls)
    #     return urls
        
    # except Exception as exc:
    #     self.retry(exc=exc, countdown=2 ** self.request.retries)

    '''
    
    print("Creating variants...")  # Debug log
    variants = create_variants(image_data)
    
    print(f"Created {len(variants)} variants, uploading...")  # Debug log
    urls = {}
    for variant_type, img_data in variants.items():
        key = f"uploads/comics/public/{comic_id}/pages/{page_number}-{variant_type}{extension}"
        url = upload_processed_image(img_data, key)
        urls[f"{variant_type}_url"] = url
        print(f"Uploaded {variant_type}")  # Debug log
    
    print("Updating database...")  # Debug log
    update_database(page_id, urls)
    print("Database updated!")  # Debug log
    return urls
    
except Exception as exc:
    print(f"Error processing image: {exc}")  # Debug log
    self.retry(exc=exc, countdown=2 ** self.request.retries)
    '''

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