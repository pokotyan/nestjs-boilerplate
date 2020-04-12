import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SampleController } from '../../controller/samples/controller';
import { SampleService } from '../../service/sample/service';
import { SampleRepository } from '../../repository/sample';

@Module({
  imports: [TypeOrmModule.forFeature([SampleRepository])],
  controllers: [SampleController],
  providers: [SampleService],
})
export class SampleModule {}
