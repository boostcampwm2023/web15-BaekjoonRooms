import { Test, TestingModule } from '@nestjs/testing';
import { Example2Gateway } from './example2.gateway';

describe('Example2Gateway', () => {
  let gateway: Example2Gateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [Example2Gateway],
    }).compile();

    gateway = module.get<Example2Gateway>(Example2Gateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
