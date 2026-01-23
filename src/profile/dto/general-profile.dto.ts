import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class profileIdParamDto {
  @ApiProperty({
    description: 'The ID of the user to retrieve',
    example: '2ed22968-9603-4057-8267-60941ee75d34',
  })
  @IsUUID()
  id: string;
}
