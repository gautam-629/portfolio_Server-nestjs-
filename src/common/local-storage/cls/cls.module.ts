import { Module } from '@nestjs/common';
import { ClsModule } from 'nestjs-cls';
import { Providers } from 'src/common/providers/providers';
import { CLSServiceImp } from './cls.service';

@Module({
  imports: [
    ClsModule.forRoot({
      global: true,
      middleware: {
        mount: true,
        useEnterWith: true,
      },
    }),
  ],
  providers: [
    {
      provide: Providers.LOCAL_STORAGE_SERVICE,
      useClass: CLSServiceImp,
    },
  ],
})
export class CLSModule {}
