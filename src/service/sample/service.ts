/* eslint-disable @typescript-eslint/camelcase */
import { Injectable } from '@nestjs/common';
import { Connection } from 'typeorm';
import { Console, Command } from 'nestjs-console';
import { SampleRepository } from '../../repository/sample';
import { Sample } from '../../entity/sample';
import { CreateParams } from '../../controller/samples/dto';

@Console({
  name: 'sample',
  description: 'SampleServiceのコマンド'
})
@Injectable()
export class SampleService {
  constructor(private sampleRepository: SampleRepository, private connection: Connection) {}

  @Command({
    command: 'find <sampleId>',
    description: '指定したidのsamplesのデータを取得します'
  })  
  async findById(sampleId: number): Promise<Sample> {
    return this.sampleRepository.findById(sampleId);
  }

  @Command({
    command: 'findAll',
    description: 'samplesのデータを全件取得します'
  })
  findAll(): Promise<Sample[]> {
    return this.sampleRepository.find();
  }

  create(params: CreateParams): Promise<Sample> {
    return this.connection.transaction(async (manager) => {
      const sampleRepository = manager.getCustomRepository(SampleRepository);

      return sampleRepository.save({
        ...params,
        created_at: new Date(),
        updated_at: new Date(),
      });
    });
  }
}
