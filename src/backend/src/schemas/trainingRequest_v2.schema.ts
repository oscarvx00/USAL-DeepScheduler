import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Document } from 'mongoose';
import { User } from './user.schema';
import { Worker } from './worker.schema'


export type TrainingRequestV2Document = Request & Document

@Schema({collection: 'trainingrequests_v2'})
export class TrainingRequestV2 {

    @Prop()
    imageName : string

    @Prop()
    quadrants : number[]

    @Prop()
    status : string

    @Prop({type: mongoose.Schema.Types.ObjectId, ref: 'User'})
    user : User

    @Prop({
        required: true
    })
    date : Date

    @Prop({type: mongoose.Schema.Types.ObjectId, ref: 'Worker'})
    worker : Worker
}

export const TrainingRequestV2Schema = SchemaFactory.createForClass(TrainingRequestV2)