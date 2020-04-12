import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SampleController } from '../../controller/samples/controller';
import { SampleRepository } from '../../repository/sample';
import { SampleService } from '../../service/sample/service';
import { Sample } from '../../entity/sample';

describe('SampleController', () => {
  let sampleService: SampleService;
  let sampleController: SampleController;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TypeOrmModule.forRoot(), TypeOrmModule.forFeature([SampleRepository])],
      controllers: [SampleController],
      providers: [SampleService],
    }).compile();

    sampleService = module.get<SampleService>(SampleService);
    sampleController = module.get<SampleController>(SampleController);
  });

  describe('定義されている', () => {
    it('コントローラーが定義されている', () => {
      expect(sampleController).toBeDefined();
    });
  });

  describe('findAll', () => {
    it('Sampleエンティティの配列が返ってくる', async () => {
      const resultMock = [{
        id: 1,
        sasage: 'hoge',
      }] as Sample[];
      jest.spyOn(sampleService, 'findAll').mockImplementation(async () => resultMock);

      expect(await sampleController.findAll()).toBe(resultMock);
    });
  });
});
