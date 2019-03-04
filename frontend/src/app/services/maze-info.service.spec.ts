import { TestBed, inject } from '@angular/core/testing';

import { MazeInfoService } from './maze-info.service';

describe('MazeInfoService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MazeInfoService]
    });
  });

  it('should be created', inject([MazeInfoService], (service: MazeInfoService) => {
    expect(service).toBeTruthy();
  }));
});
