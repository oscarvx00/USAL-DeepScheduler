import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';
import { MailService } from './mail.service';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter'
import { join } from 'path';

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        service: "Gmail",
        auth: {
          user: process.env.VERIFICATION_MAIL_USER,
          pass: process.env.VERIFICATION_MAIL_PASSWORD
        }
      },
      defaults: {
        from: '"No Reply" <deepscheduler@gmail.com>'
      },
      template: {
        dir: join(__dirname, 'templates'),
        adapter: new HandlebarsAdapter(),
        options: {
          strict: true
        }
      }
    })
  ],
  providers: [MailService],
  exports: [MailService]
})
export class MailModule {}
