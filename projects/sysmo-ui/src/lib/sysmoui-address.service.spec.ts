import { TestBed } from '@angular/core/testing';

import { SysmouiAddressService } from '../../../sysmo-ui/src/lib/sysmoui-address.service';

describe('SysmouiAddressService', () => {
  let service: SysmouiAddressService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SysmouiAddressService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
