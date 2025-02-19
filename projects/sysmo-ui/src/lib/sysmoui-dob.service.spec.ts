import { TestBed } from '@angular/core/testing';

import { SysmouiDobService } from './sysmoui-dob.service';

describe('SysmouiDobService', () => {
  let service: SysmouiDobService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SysmouiDobService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
