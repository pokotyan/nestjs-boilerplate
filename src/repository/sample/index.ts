import { Repository, EntityRepository } from 'typeorm';
import { Sample } from '../../entity/sample';

@EntityRepository(Sample)
export class SampleRepository extends Repository<Sample> {
  findById(id: number) {
    return this.findOne({
      where: {
        id,
      },
    });
  }
}
