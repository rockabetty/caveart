from dotenv import load_dotenv
import os

load_dotenv()

AWS_S3_ACCESS_KEY_ID = os.getenv('AWS_ACCESS_KEY_ID')
AWS_S3_SECRET_ACCESS_KEY = os.getenv('AWS_S3_SECRET_ACCESS_KEY')
AWS_S3_BUCKET_USA = os.getenv('AWS_S3_BUCKET_USA')
AWS_REGION = os.getenv('AWS_REGION')

REDIS_URL = os.getenv('REDIS_URL', 'redis://localhost:6379')