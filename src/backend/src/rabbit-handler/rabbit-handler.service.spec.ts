import { Test, TestingModule } from '@nestjs/testing';
import { RabbitHandlerService } from './rabbit-handler.service';

describe('RabbitHandlerService', () => {
  let service: RabbitHandlerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RabbitHandlerService],
    }).compile();

    service = module.get<RabbitHandlerService>(RabbitHandlerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
