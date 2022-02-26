import { NestFactory } from '@nestjs/core';
import { appendFile } from 'fs';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {cors: true});
  /*var whiteList = ["http://localhost:4200", "https://accounts.google.com"]
  const options = {
    origin: whiteList,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS"
  };

  app.enableCors(options);*/
  /*app.use(function (req, res, next){
    res.header("Access-Control-Allow-Origin", "https://accounts.google.com");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next()
  })*/
  await app.listen(3000);
}
bootstrap();
