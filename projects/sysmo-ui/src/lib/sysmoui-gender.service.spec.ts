import { TestBed } from '@angular/core/testing';

import { SysmouiGenderService } from './sysmoui-gender.service';

describe('SysmouiGenderService', () => {
  let service: SysmouiGenderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SysmouiGenderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
