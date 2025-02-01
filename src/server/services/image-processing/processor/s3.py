import boto3
from config import AWS_S3_ACCESS_KEY_ID, AWS_S3_SECRET_ACCESS_KEY, AWS_S3_BUCKET_USA, AWS_REGION
from boto3.s3.transfer import S3UploadFailedError
from botocore.exceptions import ClientError
import os

s3_client = boto3.client(
    's3',
    aws_access_key_id=AWS_S3_ACCESS_KEY_ID,
    aws_secret_access_key=AWS_S3_SECRET_ACCESS_KEY,
    region_name=AWS_REGION
)

def download_image(url: str) -> bytes:
    _, _, s3_key = url.partition('.com')
    s3_key = s3_key.lstrip('/')

    try:
        response = s3_client.get_object(
            Bucket=AWS_S3_BUCKET_USA,
            Key=s3_key
        )   
        return response['Body'].read(), response['ContentType']
    except ClientError as err:
        print(f"Error downloading from S3: {err}")
        raise

def upload_processed_image(image_data: bytes, key: str) -> str:
    # Upload to S3
    try:
        response = s3_client.put_object(
            Bucket=AWS_S3_BUCKET_USA,
            Key=key,
            Body=image_data
        )
        return f"https://{AWS_S3_BUCKET_USA}.s3.{AWS_REGION}.amazonaws.com/{key}"
    except S3UploadFailedError as err:
        print(f"Error uploading to S3: {err}")
        raise