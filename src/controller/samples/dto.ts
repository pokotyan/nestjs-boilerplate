import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumberString } from 'class-validator';

export class FindByIdParams {
  @ApiProperty({
    description: 'sample_idでの検索',
    type: Number,
  })
  @IsNumberString()
  sample_id: number;
}

export class CreateParams {
  @ApiProperty()
  @IsNotEmpty()
  sasage: string;
}
