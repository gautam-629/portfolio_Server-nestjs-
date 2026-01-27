import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class TechIdPramDto {
  @ApiProperty({
    description: 'The id of the tech to retrive',
    example: 've87t8374387yr8374y3874ty3874f387439834',
  })
  @IsUUID()
  id: string;
}
