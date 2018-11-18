import { TestBed, inject } from '@angular/core/testing';

import { TreeLogicService } from './tree-logic.service';

describe('TreeLogicService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TreeLogicService]
    });
  });

  it('should be created', inject([TreeLogicService], (service: TreeLogicService) => {
    expect(service).toBeTruthy();
  }));
});
