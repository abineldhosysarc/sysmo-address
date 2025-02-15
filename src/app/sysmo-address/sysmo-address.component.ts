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
  copyFromCurrentAddress: boolean[] = [];
  copyFromPermanentAddress: boolean[] = [];

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
    this.copyFromCurrentAddress = new Array(this.addressTypes.length).fill(false);
    this.copyFromPermanentAddress = new Array(this.addressTypes.length).fill(false);

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

  areAddressesEqual(index1: number, index2: number): boolean {
    const address1 = this.getAddressGroup(index1).getRawValue();
    const address2 = this.getAddressGroup(index2).getRawValue();
    
    return this.addressFields.every(field => 
      address1[field.id] === address2[field.id]
    );
  }

  copyAddress(arrayIndex: number, event: CustomEvent, sourceType: 'current' | 'permanent') {
    const isChecked = event.detail.checked;
    this.copyFromCurrentAddress[arrayIndex] = false;
    this.copyFromPermanentAddress[arrayIndex] = false;
    
    if (sourceType === 'current') {
      this.copyFromCurrentAddress[arrayIndex] = isChecked;
    } else {
      this.copyFromPermanentAddress[arrayIndex] = isChecked;
    }
    this.readOnlyStates[arrayIndex] = isChecked;
    
    if (isChecked) {
      const sourceIndex = sourceType === 'current' ? 0 : 
        this.addressTypes.findIndex(type => type.id.toLowerCase() === 'permanent');
      if (sourceIndex !== -1) {
        const sourceAddress = this.getAddressGroup(sourceIndex).getRawValue();
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

        currentGroup.patchValue(copyValues);}
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

  getAddressGroup(arrayIndex: number): FormGroup {
    return (this.addressForm.get('addresses') as FormArray).at(arrayIndex) as FormGroup;
  }

  getAddresses(): FormArray {
    return this.addressForm.get('addresses') as FormArray;
  }

  showCopyFromCurrent(arrayIndex: number): boolean {
    return arrayIndex > 0;
  }

  showCopyFromPermanent(arrayIndex: number): boolean {
    const addressType = this.getAddressGroup(arrayIndex).get('type')?.value;
    const permanentIndex = this.addressTypes.findIndex(type => type.id.toLowerCase() === 'permanent');
    const currentIndex = 0;
    
    return !this.isPermanentAddress(addressType) && 
           addressType.toLowerCase() !== 'current' &&
           permanentIndex !== -1 &&
           !this.areAddressesEqual(currentIndex, permanentIndex);
  }

  isPermanentAddress(addressType: string): boolean {
    return addressType.toLowerCase() === 'permanent';
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
    this.copyFromCurrentAddress = new Array(this.addressTypes.length).fill(false);
    this.copyFromPermanentAddress = new Array(this.addressTypes.length).fill(false);
    this.addressChange.emit(null);
    this.cdr.markForCheck();
  }
  getErrorMessage(formGroup: FormGroup, field: AddressField): string {
    const control = formGroup.get(field.id);
    if (!control?.errors || !control.touched) return '';
  
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

  checkboxCurrent(): string {
    return this.getStyleValue('checkboxPermanentlabel');
  }

  checkboxPermanent(): string {
    return this.getStyleValue('checkboxPermanentlabel');
  }

  checkedPermanent(): string {
    return this.getStyleValue('checkedPermanent');
  }

  checkedCurrent(): string {
    return this.getStyleValue('checkedCurrent');
  }

  getFontSize(): string {
    return this.getStyleValue('fontSize');
  }

  textAlign(): string {
    return this.getStyleValue('textAlign');
  }

  textAlignInput(): string {
    return this.getStyleValue('textAlignInput');
  }

  textAlignErrorMessage(): string {
    return this.getStyleValue('textAlignErrorMessage');
  }

  fontSizeErrorMessage(): string {
    return this.getStyleValue('fontSizeErrorMessage');
  }

  checkboxTextAlign(): string {
    return this.getStyleValue('checkboxTextAlign');
  }

  getFormStyle(): { [klass: string]: any } {
    return {
      position: this.getStyleValue('formDivPosition') ,
      left: this.getStyleValue('formDivLeft'),
      top: this.getStyleValue('formDivTop'),
    };
  }
  
  getIonCardStyles() {
    return {
      width: this.getStyleValue('ionCardWidth'),
      padding: this.getStyleValue('cardPadding'),
      '--background': this.getStyleValue('cardBackground'),
      '--color': this.getStyleValue('cardColor')
    };
  }

  markAllFieldsAsTouched() {
    const addressesArray = this.getAddresses();
    (addressesArray.controls as FormGroup[]).forEach((addressGroup: FormGroup) => {
      Object.keys(addressGroup.controls).forEach(key => {
        const control = addressGroup.get(key);
        if (control) {
          control.markAsTouched();
          control.updateValueAndValidity();
        }
      });
    });
    this.cdr.markForCheck();
  }

}