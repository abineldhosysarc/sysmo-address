import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SysmouiAddressComponent } from './sysmoui-address.component';
import { Component, ViewChild } from '@angular/core';

@Component({
  standalone: true,
  imports: [
    SysmouiAddressComponent,
   
  ],
  template: `<sysmoui-address
               [addressTypes]="addressTypes"
               [addressFields]="addressFields"
               [errorMessages]="errorMessages"
               [styles]="styles">
             </sysmoui-address>`
})
class TestHostComponent {
  @ViewChild(SysmouiAddressComponent) addressComponent!: SysmouiAddressComponent;
  
  addressTypes = [
    { id: 'current', label: 'Current Address', required: true },
    { id: 'permanent', label: 'Permanent Address', required: true },
    { id: 'office', label: 'Office Address', required: false },
    { id: 'office2', label: 'Office2 Address', required: false },
    { id: 'office3', label: 'Office3 Address', required: false }
  ];
  
  addressFields = [
    { id: 'addressLine1', label: 'Address Line 1', required: true, type: 'text', maxLength: 100 },
    { id: 'addressLine2', label: 'Address Line 2', required: false, type: 'text', maxLength: 100 },
    { id: 'city', label: 'City', required: true, type: 'text', maxLength: 50 },
    { id: 'state', label: 'State', required: true, type: 'select', options: ['State1', 'State2', 'State3', 'State4','state5'] },
    { id: 'country', label: 'Country', required: true, type: 'select', options: ['Country1', 'Country2','country3'] },
    { id: 'pinCode', label: 'PIN Code', required: true, type: 'text', maxLength: 6 }
  ];
  
  errorMessages = {
    addressLine1: { required: 'Address Line 1 is required' },
    city: { required: 'City is required' },
    state: { required: 'State is required' },
    country: { required: 'Country is required' },
    pinCode: { required: 'PIN Code is required' }
  };

  styles = {
    'color': 'red'
  };

}

describe('SysmouiAddressComponent', () => {
  let hostComponent: TestHostComponent;
  let Fixture: ComponentFixture<TestHostComponent>;
  let component: SysmouiAddressComponent;

  beforeEach(() => {
    Fixture = TestBed.createComponent(TestHostComponent);
    hostComponent = Fixture.componentInstance;
    Fixture.detectChanges();
    component = hostComponent.addressComponent;
  });

  it('should set the first address type as the selected segment', () => {
    expect(component.selectedSegment).toBe(hostComponent.addressTypes[0].id);
  });
  
  it('should restrict PIN code input to no more than 6 characters', () => {
    const mockEvent = {
      target: { value: '1234567' }, 
      preventDefault: jasmine.createSpy('preventDefault')
    };
    expect(component.restrictPinCodeInput(mockEvent)).toBeFalsy();
  }); 

  it('should apply global styles', () => {
    const styles = component.getGlobalStyles();
    expect(styles['color']).toBe('red');
  });
  
});
