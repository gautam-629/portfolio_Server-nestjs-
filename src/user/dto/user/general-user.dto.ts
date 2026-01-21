import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsNumber, Min, IsUUID } from 'class-validator';

export class PaginationQueryDto {
  @ApiPropertyOptional({
    description: 'Page number for pagination',
    example: 1,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  page?: number;

  @ApiPropertyOptional({
    description: 'Number of items per page',
    example: 10,
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  limit?: number;
}
export class UserIdParamDto {
  @ApiProperty({
    description: 'The ID of the user to retrieve',
    example: '2ed22968-9603-4057-8267-60941ee75d34',
  })
  @IsUUID()
  id: string;
}
