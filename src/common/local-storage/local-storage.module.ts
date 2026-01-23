import { Module } from '@nestjs/common';
import { CLSModule } from './cls/cls.module';

@Module({
  imports: [CLSModule],
  exports: [CLSModule],
})
export class LocalStorageModule {}
