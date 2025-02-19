import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SysmoDobComponent } from './sysmoui-dob.component';

describe('SysmouiDobComponent', () => {
  let component:SysmoDobComponent;
  let fixture: ComponentFixture<SysmoDobComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SysmoDobComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SysmoDobComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
