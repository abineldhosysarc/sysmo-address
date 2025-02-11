import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SysmoAddressComponent } from './sysmo-address.component';

describe('SysmoAddressComponent', () => {
  let component: SysmoAddressComponent;
  let fixture: ComponentFixture<SysmoAddressComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [SysmoAddressComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SysmoAddressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
