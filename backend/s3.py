import boto3
import os
from botocore.exceptions import ClientError
from botocore.config import Config
from dotenv import load_dotenv

load_dotenv()

# ✅ Mandatory for modern S3 regions like eu-north-1 (Stockholm)
s3_config = Config(signature_version='s3v4')

s3 = boto3.client(
    's3',
    aws_access_key_id=os.getenv("AWS_ACCESS_KEY_ID"),
    aws_secret_access_key=os.getenv("AWS_SECRET_ACCESS_KEY"),
    config=s3_config
)

def upload_to_s3(file_path, filename):
    bucket_name = os.getenv("S3_BUCKET_NAME", "resume-ai-bucket")
    s3.upload_file(file_path, bucket_name, filename)
    return filename  # Return the key instead of the full URL

def generate_presigned_url(filename, expiration=3600):
    """Generate a presigned URL to share an S3 object"""
    bucket_name = os.getenv("S3_BUCKET_NAME", "resume-ai-bucket")
    try:
        response = s3.generate_presigned_url(
            'get_object',
            Params={'Bucket': bucket_name, 'Key': filename},
            ExpiresIn=expiration
        )
    except ClientError as e:
        print(f"Error generating presigned URL: {e}")
        return None

    return response