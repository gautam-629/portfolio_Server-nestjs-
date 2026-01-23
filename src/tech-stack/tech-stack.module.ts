import { Module } from '@nestjs/common';
import { TechStackService } from './tech-stack.service';
import { TechStackController } from './tech-stack.controller';
import { CLSServiceImp } from 'src/common/local-storage/cls/cls.service';

@Module({
  controllers: [TechStackController],
  providers: [TechStackService, CLSServiceImp],
})
export class TechStackModule {}
