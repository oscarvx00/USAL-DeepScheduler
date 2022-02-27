import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-github2';

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy, 'github'){

    constructor(){
        super({
            clientID: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_SECRET,
            callbackURL: process.env.BACKEND_HOST + '/auth/github/redirect',
            scope: ['email', 'profile'],
        })
    }

    async validate (accessToken: string, refreshToken: string, profile: any, done: VerifyCallback): Promise<any> {
        const { name, emails} = profile

        const user = {
            username: profile.username,
            id: profile.id,
            email: profile._json.email
        }

        done(null, user)
    }
}
