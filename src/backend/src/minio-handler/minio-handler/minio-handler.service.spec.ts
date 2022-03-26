import { Test, TestingModule } from '@nestjs/testing';
import { MinioHandlerService } from './minio-handler.service';

describe('MinioHandlerService', () => {
  let service: MinioHandlerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MinioHandlerService],
    }).compile();

    service = module.get<MinioHandlerService>(MinioHandlerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
