import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Document } from 'mongoose';
import { User } from './user.schema';


export type TrainingRequestDocument = Request & Document

@Schema()
export class TrainingRequest {

    @Prop()
    imageName : string

    @Prop()
    computingTime : number

    @Prop()
    status : string

    @Prop({type: mongoose.Schema.Types.ObjectId, ref: 'User'})
    user : User
}

export const TrainingRequestSchema = SchemaFactory.createForClass(TrainingRequest)