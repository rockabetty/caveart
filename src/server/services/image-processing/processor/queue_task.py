from celery_app import app

def queue_image_processing(page_id, image_url, comic_id, page_number):
    app.send_task('processor.tasks.process_comic_image', 
                 args=[page_id, image_url, comic_id, page_number])