from minio import Minio

MINIO_CLIENT = "localhost:30011"

minioClient = Minio(
    MINIO_CLIENT,
    access_key="myaccesskey",
    secret_key="mysecretkey",
    secure=False
)

#minioClient.make_bucket("test-bucket")

minioClient.fput_object(
    'test-bucket', 'test-user/test.zip', '/tmp/6267c48356bf2d0ecc6f94a6.zip'
)