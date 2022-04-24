import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

export type WorkerDocument = Request & Document

@Schema()
export class Worker {
    @Prop()
    name : string
}

export const WorkerSchema = SchemaFactory.createForClass(Worker)