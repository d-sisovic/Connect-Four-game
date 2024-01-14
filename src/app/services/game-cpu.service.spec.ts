import { TestBed } from '@angular/core/testing';
import { GameCpuService } from './game-cpu.service';

describe('GameCpuService', () => {
  let service: GameCpuService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GameCpuService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
