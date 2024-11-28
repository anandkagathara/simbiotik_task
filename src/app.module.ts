import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { BooksModule } from './books/books.module';
import { TopicsModule } from './topics/topics.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    //We need to write this database URL into the .env file, but for submission purposes, I have written it here directly.
    MongooseModule.forRoot('mongodb+srv://bholukagathara98:HfRyK1RhPvu2Gt7s@simbiotiktask.rhlui.mongodb.net/simbiotiktask'),
    BooksModule,
    TopicsModule,
  ],
})
export class AppModule {}