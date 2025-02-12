import { Component, Output, EventEmitter, Input, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormArray } from '@angular/forms';
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
  options?: string[];
}

@Component({
  selector: 'sysmo-address',
  templateUrl: './sysmo-address.component.html',
  styleUrls: ['./sysmo-address.component.scss'],
  standalone: true,
  imports: [IonicModule, ReactiveFormsModule, CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SysmoAddressComponent implements OnInit {
  @Input() addressTypes: AddressType[] = [];
  @Input() addressFields: AddressField[] = [];
  @Output() addressChange = new EventEmitter<any>();

  @Input() showCurrentAddressCheckbox: boolean = false;
  addressForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private cdr: ChangeDetectorRef
  ) {
    this.addressForm = this.formBuilder.group({
      addresses: this.formBuilder.array([]),
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
    this.addressTypes.forEach(addressType => {
      addressesArray.push(this.createAddressGroup(addressType));
    });
    this.cdr.markForCheck();
  }

  private createAddressGroup(addressType: AddressType): FormGroup {
    const formGroup: any = {
      type: [addressType.id],
      label: [addressType.label],
      required: [addressType.required],
    };

    this.addressFields.forEach(addressField => {
      const fieldValidators = [];
      if (addressType.required && addressField.required) {
        fieldValidators.push(Validators.required);
      }
      if (addressField.validators) {
        fieldValidators.push(...addressField.validators);
      }
      formGroup[addressField.id] = ['', fieldValidators.length > 0 ? fieldValidators : null];
    });

    return this.formBuilder.group(formGroup);
  }

  getAddressGroup(arrayIndex: number): FormGroup {
    return (this.addressForm.get('addresses') as FormArray).at(arrayIndex) as FormGroup;
  }

  getAddresses(): FormArray {
    return this.addressForm.get('addresses') as FormArray;
  }

  copyAddress(targetIndex: number) {
    if (targetIndex > 0) {
      const sourceAddress = this.getAddressGroup(targetIndex - 1).value;
      const copyValues: any = {};
      
      this.addressFields.forEach(addressField => {
        copyValues[addressField.id] = sourceAddress[addressField.id];
      });

      this.getAddressGroup(targetIndex).patchValue(copyValues);
      this.cdr.markForCheck();
    }
  }

  private formatAddressData(formValue: any) {
    const formattedData: any = {};
    formValue.addresses.forEach((addressData: any) => {
      const processedAddress: any = {};
      this.addressFields.forEach(addressField => {
        processedAddress[addressField.id] = addressData[addressField.id];
      });
      formattedData[addressData.type] = processedAddress;
    });
    return formattedData;
  }
  restrictPinCodeInput(event: any): boolean {
    const currentValue = event.target.value;
    if (currentValue.length >= 6) {
      event.preventDefault();
      return false;
    }
    return true;
  }
  isSelectField(field: AddressField): boolean {
    return field.type === 'select';
  }
  resetForm() {
    const addressesArray = this.addressForm.get('addresses') as FormArray;
    addressesArray.clear();
    this.initializeAddresses();
    this.addressChange.emit(null);
    this.cdr.markForCheck();
  }
}