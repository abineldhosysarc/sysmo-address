import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SuccessfulPage } from './successful.page';

describe('SuccessfulPage', () => {
  let component: SuccessfulPage;
  let fixture: ComponentFixture<SuccessfulPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(SuccessfulPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
