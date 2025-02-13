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
interface StyleConfig {
  name: string;
  value: string;
}
interface ErrorMessages {
  required?: string;
  maxlength?: string;
  pattern?: string;
  [key: string]: string | undefined;
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
  @Input() errorMessages: { [fieldId: string]: ErrorMessages } = {};
  @Input() styleConfigs: StyleConfig[] = [];
  @Output() addressChange = new EventEmitter<any>();
  addressForm: FormGroup;
  selectedSegment: string;
  readOnlyStates: boolean[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private cdr: ChangeDetectorRef
  ) {
    this.addressForm = this.formBuilder.group({
      addresses: this.formBuilder.array([]),
    });
    this.selectedSegment = '';
  }

  ngOnInit() {
    this.initializeAddresses();
    this.selectedSegment = this.addressTypes[0]?.id || '';
    this.readOnlyStates = new Array(this.addressTypes.length).fill(false);

    this.addressForm.valueChanges.subscribe(value => {
      if (this.addressForm.valid) {
        this.addressChange.emit(this.formatAddressData(value));
      }
    });
  }

  segmentChanged(event: CustomEvent) {
    this.selectedSegment = event.detail.value;
    this.cdr.markForCheck();
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
    const formGroup: { [key: string]: any } = {
      type: [{ value: addressType.id, disabled: false }],
      label: [{ value: addressType.label, disabled: false }],
      required: [{ value: addressType.required, disabled: false }],
    };

    this.addressFields.forEach(addressField => {
      const fieldValidators = [];
      if (addressType.required && addressField.required) {
        fieldValidators.push(Validators.required);
      }
      if (addressField.validators) {
        fieldValidators.push(...addressField.validators);
      }
      formGroup[addressField.id] = [{ 
        value: '', 
        disabled: false 
      }, fieldValidators.length > 0 ? fieldValidators : null];
    });

    return this.formBuilder.group(formGroup);
  }

  getAddressGroup(arrayIndex: number): FormGroup {
    return (this.addressForm.get('addresses') as FormArray).at(arrayIndex) as FormGroup;
  }

  getAddresses(): FormArray {
    return this.addressForm.get('addresses') as FormArray;
  }

  copyAddress(arrayIndex: number, event: CustomEvent) {
    const isChecked = event.detail.checked;
    this.readOnlyStates[arrayIndex] = isChecked;
    
    if (isChecked && arrayIndex > 0) {
      const sourceAddress = this.getAddressGroup(arrayIndex - 1).getRawValue();
      const copyValues: { [key: string]: any } = {};
      
      this.addressFields.forEach(addressField => {
        copyValues[addressField.id] = sourceAddress[addressField.id];
      });

      const currentGroup = this.getAddressGroup(arrayIndex);
      
      Object.keys(copyValues).forEach(key => {
        const control = currentGroup.get(key);
        if (control) {
          if (isChecked) {
            control.disable();
          } else {
            control.enable();
          }
        }
      });

      currentGroup.patchValue(copyValues);
    } else {
      const currentGroup = this.getAddressGroup(arrayIndex);
      Object.keys(currentGroup.controls).forEach(key => {
        const control = currentGroup.get(key);
        if (control) {
          control.enable();
        }
      });
    }
    
    this.cdr.markForCheck();
  }
  isReadOnly(arrayIndex: number): boolean {
    return this.readOnlyStates[arrayIndex];
  }

  private formatAddressData(formValue: any) {
    const formattedData: { [key: string]: any } = {};
    const addresses = this.getAddresses();
    
    (addresses.controls as FormGroup[]).forEach((addressGroup: FormGroup) => {
      const addressData = addressGroup.getRawValue();
      const processedAddress: { [key: string]: any } = {};
      
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
    this.selectedSegment = this.addressTypes[0]?.id || '';
    this.readOnlyStates = new Array(this.addressTypes.length).fill(false);
    this.addressChange.emit(null);
    this.cdr.markForCheck();
  }
  getErrorMessage(formGroup: FormGroup, field: AddressField): string {
    const control = formGroup.get(field.id);
    if (!control?.errors) return '';
  
    const fieldErrors = this.errorMessages[field.id] || {};
    
    for (const errorKey in control.errors) {
      if (fieldErrors[errorKey]) {
        return fieldErrors[errorKey]!;
      }
    }
    return '';
  }

  getStyleValue(name: string): string {
    const config = this.styleConfigs.find(style => style.name === name);
    return config ? config.value : '';
  }
  
  getLabelColor(): string {
    return this.getStyleValue('labelColor');
  }
  
  getSegmentColor(): string {
    return this.getStyleValue('segmentColor');
  }

  getIonCardStyles() {
    return {
      width: this.getStyleValue('ionCardWidth'),
      height: this.getStyleValue('ionCardHeight')
    };
  }
}