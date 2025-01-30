import boto3
from config import AWS_ACCESS_KEY_ID, AWS_S3_SECRET_ACCESS_KEY, AWS_S3_BUCKET_USA, AWS_REGION

s3_client = boto3.client(
    's3',
    aws_access_key_id=AWS_ACCESS_KEY_ID,
    aws_secret_access_key=AWS_S3_SECRET_ACCESS_KEY,
    region_name=AWS_REGION
)

def download_image(url: str) -> bytes:
    _, _, s3Key = url.partition('.com').lstrip('/')

    try:
        response = s3_client.get_object(
            Bucket=AWS_S3_BUCKET_USA,
            Key=s3_key
        )   
        return response['Body'].read(), response['ContentType']
    except Exception as e:
        print(f"Error downloading from S3: {e}")
        raise

def upload_processed_image(image_data: bytes, key: str) -> str:
    # Upload to S3
    if object_name is None:
        object_name = os.path.basename(file_name)

    try:
        response = s3_client.upload_file(file_name, AWS_S3_BUCKET_USA, object_name)


    # Return URL
    pass