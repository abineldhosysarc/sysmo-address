// sysmo-address.component.ts
import { Component, Output, EventEmitter, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormArray, AbstractControl } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';

interface AddressType {
  id: string;
  label: string;
  required: boolean;
}

interface AddressField {
  id: string;
  label: string;
  required: boolean;
  type: string;
  validators?: any[];
  maxLength?: number;
}

@Component({
  selector: 'app-sysmo-address',
  templateUrl: './sysmo-address.component.html',
  styleUrls: ['./sysmo-address.component.scss'],
  standalone: true,
  imports: [IonicModule, ReactiveFormsModule, CommonModule],
})
export class SysmoAddressComponent implements OnInit {
  @Input() addressTypes: AddressType[] = [];
  @Input() addressFields: AddressField[] = [];
  @Output() addressChange = new EventEmitter<any>();

  @Input() showCurrentAddressCheckbox: boolean = false;
  addressForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.addressForm = this.fb.group({
      addresses: this.fb.array([]),
    });
  }

  ngOnInit() {
    this.initializeAddresses();

    this.addressForm.valueChanges.subscribe(value => {
      if (this.addressForm.valid) {
        this.addressChange.emit(this.formatAddressData(value));
      }
    });
  }

  private initializeAddresses() {
    const addressesArray = this.addressForm.get('addresses') as FormArray;
    addressesArray.clear();
    this.addressTypes.forEach(type => {
      addressesArray.push(this.createAddressGroup(type));
    });
  }

  private createAddressGroup(type: AddressType): FormGroup {
    const group: any = {
      type: [type.id],
      label: [type.label],
      required: [type.required],
    };

    this.addressFields.forEach(field => {
      const validators = [];
      if (type.required && field.required) {
        validators.push(Validators.required);
      }
      if (field.validators) {
        validators.push(...field.validators);
      }
      group[field.id] = ['', validators.length > 0 ? validators : null];
    });

    return this.fb.group(group);
  }

  getAddressGroup(index: number): FormGroup {
    return (this.addressForm.get('addresses') as FormArray).at(index) as FormGroup;
  }

  getAddresses(): FormArray {
    return this.addressForm.get('addresses') as FormArray;
  }

  isFieldInvalid(addressControl: AbstractControl, fieldId: string): boolean {
    if (addressControl instanceof FormGroup) {
      const control = addressControl.get(fieldId);
      return control ? (control.invalid && (control.dirty || control.touched)) : false;
    }
    return false;
  }

  getFieldErrorMessage(addressControl: AbstractControl, field: AddressField): string {
    if (addressControl instanceof FormGroup) {
      const control = addressControl.get(field.id);
      if (control && control.errors) {
        if (control.errors['required']) {
          return `${field.label} is required`;
        }
        if (control.errors['pattern']) {
          if (field.id === 'pincode') {
            return 'Please enter a valid 6-digit pincode';
          }
          return `Invalid ${field.label} format`;
        }
      }
    }
    return '';
  }

  copyAddress(index: number) {
    if (index > 0) {
      const previousAddress = this.getAddressGroup(index - 1).value;
      const valuesToCopy: any = {};
      
      this.addressFields.forEach(field => {
        valuesToCopy[field.id] = previousAddress[field.id];
      });

      this.getAddressGroup(index).patchValue(valuesToCopy);
    }
  }

  private formatAddressData(value: any) {
    const formattedData: any = {};
    value.addresses.forEach((address: any) => {
      const addressData: any = {};
      this.addressFields.forEach(field => {
        addressData[field.id] = address[field.id];
      });
      formattedData[address.type] = addressData;
    });
    return formattedData;
  }
}