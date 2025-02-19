import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SysmouiGenderComponent } from './sysmoui-gender.component';

describe('SysmouiGenderComponent', () => {
  let component: SysmouiGenderComponent;
  let fixture: ComponentFixture<SysmouiGenderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SysmouiGenderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SysmouiGenderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
