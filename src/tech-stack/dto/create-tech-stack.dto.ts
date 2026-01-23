import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateTechStackDto {
  @ApiProperty({
    example: 'Node js',
    description: 'Tech Title',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    example: 'Node js is a Javascript Runtime',
    description: 'Node js description',
  })
  @IsString()
  @IsOptional()
  description: string;
}
