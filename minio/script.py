from pydoc import cli
from minio import Minio
from minio.error import S3Error

def main():
    #Create clientS
    client  = Minio(
        "minio-oscarvx00.cloud.okteto.net",
        access_key="myaccesskey",
        secret_key="mysecretkey"
    )

    bucketName = "user-test"

    #Create test user bucket if not exists
    found = client.bucket_exists(bucketName)
    if not found:
        client.make_bucket(bucketName)
    else:
        print("Bucket already exists")

    client.fput_object(
        bucketName, "Dockerfile", "/home/oscar/Escritorio/TFG/usal-deepscheduler/pytorch/user-project/Dockerfile"
    )
    print("Object uploaded")

if __name__ == "__main__":
    try:
        main()
    except S3Error as exc:
        print("Error", exc)