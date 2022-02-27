import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document

@Schema()
export class User {
    @Prop({
        unique: true
    })
    username : string
    
    @Prop()
    password : string | null

    @Prop({})
    mail : string

    @Prop({
        default: false
    })
    mailVerified : boolean

    @Prop()
    confirmationCode : string | null

    @Prop()
    googleId : string | null

    @Prop()
    githubId : string | null

    
}

export const UserSchema = SchemaFactory.createForClass(User)