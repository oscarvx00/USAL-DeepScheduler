import { Prop, Schema } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Document } from 'mongoose';
import { User } from './user.schema';


export type RequestDocument = Request & Document

@Schema()
export class Request {
    @Prop()
    id : string

    @Prop()
    executionTime : number

    @Prop({type: mongoose.Schema.Types.ObjectId, ref: 'User'})
    user : User
}