import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { MailModule } from 'src/mail/mail.module';
import { UsersModule } from 'src/users/users.module';
import { AuthService } from './auth.service';
import { jwtConstants } from './strategies/constants';
import { GithubStrategy } from './strategies/github.strategy';
import { GitlabStrategy } from './strategies/gitlab.strategy';
import { GoogleStrategy } from './strategies/google.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';

@Module({
  imports: [
    UsersModule, 
    PassportModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: {expiresIn: '300s'},
    }),
    MailModule,
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy, GoogleStrategy, GithubStrategy, GitlabStrategy],
  exports: [AuthService]
})
export class AuthModule {}
