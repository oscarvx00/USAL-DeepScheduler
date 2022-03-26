import { Inject, Injectable, InternalServerErrorException } from '@nestjs/common';
import { MINIO_CONNECTION } from 'nestjs-minio';
import {Client} from 'minio';

@Injectable()
export class MinioHandlerService {

    constructor(
        @Inject(MINIO_CONNECTION) private minioClient : Client
    ) {}

    public async getPresignedUrl(filename : string){
        return await this.minioClient.presignedUrl('GET', 'users-results', filename)
    }

}
