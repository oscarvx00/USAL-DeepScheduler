import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, VerifyCallback } from "passport-gitlab2";



@Injectable()
export class GitlabStrategy extends PassportStrategy(Strategy, 'gitlab'){

    constructor(){
        super({
            clientID: process.env.GITLAB_CLIENT_ID,
            clientSecret: process.env.GITLAB_SECRET,
            callbackURL: process.env.BACKEND_HOST + '/auth/gitlab/redirect',
            scope: ['read_user'],
        })
    }

    async validate (accessToken: string, refreshToken: string, profile: any, done: VerifyCallback): Promise<any> {

        const user = {
            username: profile.username,
            id: profile.id,
            email: profile.emails[0].value
        }

        done(null, user)
    }

}