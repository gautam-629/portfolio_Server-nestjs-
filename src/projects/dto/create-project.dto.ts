import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsArray, IsNotEmpty, IsOptional, IsString, IsUrl } from 'class-validator';

export class CreateProjectDto {
  @ApiProperty({ example: 'Ecommerce' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'This project is an ecommerce platform', required: false })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: 'https://myproject.com', required: false })
  @IsString()
  @IsUrl()
  @IsOptional()
  liveUrl?: string;

  @ApiProperty({ example: 'https://github.com/username/project', required: false })
  @IsString()
  @IsUrl()
  @IsOptional()
  githubUrl?: string;

  @ApiProperty({
    type: 'array',
    items: {
      type: 'string',
      format: 'binary',
    },
    required: false,
    description: 'Project images',
  })
  @IsOptional()
  images?: any; 

  @ApiProperty({ example: 'Build a scalable ecommerce solution' })
  @IsString()
  @IsNotEmpty()
  projectGoal: string;

  @ApiProperty({ example: 'Successfully launched with 1k+ users' })
  @IsString()
  @IsNotEmpty()
  projectOutCome: string;

  @ApiProperty({
    example:[
      'cwuebvweevbwoewec4545eiruee cv3i',
      '3f34iv3n4of3urnc3v94hvvnri4954g9v'
    ],
  })
  @Transform(({value})=>{
    if(Array.isArray(value)) return value;
    if(typeof value==='string'){
       try {
       return JSON.parse(value)
       } catch (error) {
        return value.split(',').map(v=>v.trim())
       }
    }
    return value
  })
  @IsArray()
  @IsNotEmpty()
  techIds:string[]
}
