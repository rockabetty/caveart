from dotenv import load_dotenv
import os

load_dotenv()

AWS_S3_ACCESS_KEY_ID = os.getenv('AWS_S3_ACCESS_KEY_ID')
AWS_S3_SECRET_ACCESS_KEY = os.getenv('AWS_S3_SECRET_ACCESS_KEY')
AWS_S3_BUCKET_USA = os.getenv('AWS_S3_BUCKET_USA')
AWS_REGION = os.getenv('AWS_REGION')
PG_USERNAME = os.getenv('PG_USERNAME')
PG_PASSWORD = os.getenv('PG_PASSWORD')
PG_DATABASE = os.getenv('PG_DATABASE')
PG_HOST = os.getenv('PG_HOST')
PG_PORT = os.getenv('PG_PORT', '5432')
REDIS_URL = os.getenv('REDIS_URL', 'redis://localhost:6379')
NODE_ENV = os.getenv('NODE_ENV')