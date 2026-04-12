import boto3
import os
from dotenv import load_dotenv

load_dotenv()

s3 = boto3.client(
    's3',
    aws_access_key_id=os.getenv("AWS_ACCESS_KEY_ID"),
    aws_secret_access_key=os.getenv("AWS_SECRET_ACCESS_KEY")
)

def upload_to_s3(file_path, filename):
    bucket_name = os.getenv("S3_BUCKET_NAME", "resume-ai-bucket")
    s3.upload_file(file_path, bucket_name, filename)
    return f"https://{bucket_name}.s3.amazonaws.com/{filename}"