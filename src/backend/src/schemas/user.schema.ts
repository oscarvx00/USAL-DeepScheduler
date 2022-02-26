import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document

@Schema()
export class User {
    @Prop({
        unique: true
    })
    username : string | null

    @Prop()
    password : string | null

    @Prop({
        required: true,
        unique: true
    })
    mail : string

    @Prop()
    googleId : string | null
}

export const UserSchema = SchemaFactory.createForClass(User)