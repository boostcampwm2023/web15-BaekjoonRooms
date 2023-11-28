import { Module } from '@nestjs/common';
import { Example2Gateway } from './example2.gateway';

@Module({
  providers: [Example2Gateway]
})
export class Example2Module {}
