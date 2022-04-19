import { Injectable } from '@nestjs/common';
import { User } from 'src/schemas/user.schema';
import { MailerService } from '@nestjs-modules/mailer'

@Injectable()
export class MailService {

    constructor(
        private mailerService : MailerService
    ) {}

    async sendUserConfirmation(user : User, token : string){
        const url = process.env.BACKEND_HOST + `/auth/confirm?token=${token}`

        await this.mailerService.sendMail({
            to: user.mail,
            subject: 'Welcome to Deepscheduler! Please confirm your Email',
            template: 'confirmation',
            context: {
                name: user.username,
                url
            }
        })
    }

    async sendUserRemoveCode(user : User, code : number){
        await this.mailerService.sendMail({
            to: user.mail,
            subject: 'Delete account request',
            template: 'deletion',
            context: {
                name: user.username,
                code: code
            }
        })
    }

}
