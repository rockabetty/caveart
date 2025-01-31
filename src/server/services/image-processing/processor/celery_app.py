from celery import Celery
from config import REDIS_URL

app = Celery('image_processor', 
    broker=REDIS_URL,
    backend=REDIS_URL
)

app.conf.update(
    task_serializer='json',
    accept_content=['json'],
    result_serializer='json',
    result_backend=REDIS_URL,
    timezone='UTC',
    enable_utc=True,
    broker_transport_options = {"visibility_timeout": 3600}
)