import {Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {Document,Schema as MongooseSchema } from 'mongoose';
import { Topic} from '../../topics/schemas/topic.schema';

export type BookDocument = Book & Document;

@Schema({ timestamps: true })
export class Book {
  @Prop({ required: true })
  title: string;

  @Prop({required:true})
  author: string;

  @Prop()
  publishedDate: Date;

  @Prop({ required: true, unique: true })
  isbn: string;

  @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: Topic.name }] })
  topics: Topic[];
}

export const BookSchema = SchemaFactory.createForClass(Book);