import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document

@Schema()
export class User {
    @Prop({
        unique: true,
        required: true
    })
    username : string

    @Prop({
        required: true
    })
    password : string

    @Prop({
        required: true,
        unique: true
    })
    mail : string
}

export const UserSchema = SchemaFactory.createForClass(User)