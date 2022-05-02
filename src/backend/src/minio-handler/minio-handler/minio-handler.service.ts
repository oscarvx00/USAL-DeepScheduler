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

    public async removeUserData(userId : string){
        let filesList = []

        const res = await this.minioClient.listObjects('users-results', userId, true)
        res.on('data', function(obj){
            filesList.push(obj.name)
        })
        res.on('end', async () => {
            await this.minioClient.removeObjects('users-results', filesList, function(e){
                if(e){
                    console.log(e)
                }
            })
        })
    }

}
