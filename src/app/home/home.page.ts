import { Component, ChangeDetectionStrategy, ChangeDetectorRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { SysmoAddressComponent } from '../sysmo-address/sysmo-address.component';

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
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomePage {
  mainForm: FormGroup;
  addressDetails: any;
  @ViewChild(SysmoAddressComponent) addressComponent!: SysmoAddressComponent;
  labelColor: string = 'black';
  segmentColor: string = 'danger';
  stateOptions: string[] = [
    'Kerala',
    'Karnataka',
    'Tamil Nadu',
    'Maharashtra',
    'Delhi',
    'Gujarat',
    'West Bengal',
    'Andhra Pradesh',
    'Telangana',
    'Uttar Pradesh',
    'Madhya Pradesh',
    'Punjab',
    'Rajasthan',
    'Bihar',
    'Odisha',
    'Assam',
    'Goa'
  ];
  countryOptions: string[] = [
    'India',
    'Canada',
    'UK'
  ];
  styleConfigs = [
    { name: 'ionCardWidth', value: '400px' },
    { name: 'labelColor', value: 'black' },
    { name: 'checkboxPermanentlabel', value: 'black' },
    { name: 'checkboxCurrentlabel', value: 'black' },
    { name: 'checkedCurrent', value: 'danger' },
    { name: 'checkedPermanent', value: 'danger' },
    { name: 'segmentColor', value: 'danger' },
    { name: 'cardBackground', value: '' },
    { name: 'cardColor', value: '' },
    { name: 'cardPadding', value: '' },
    { name: 'fontSize', value:''},
    { name: 'textAlign', value:''},
    { name: 'textAlignInput', value :''},
    {name : 'fontSizeErrorMessage', value:''},
    {name : 'textAlignErrorMessage', value:''},
    {name : 'checkboxTextAlign', value:''}

  ];
  addressTypes: AddressType[] = [
    { id: 'current', label: 'Current Address', required: true },
    { id: 'permanent', label: 'Permanent Address', required: true },
    { id: 'aadhar', label: 'Aadhar Address', required: false },
    { id: 'office', label: 'Office Address', required: false },
    { id: 'correspondence', label: 'Correspondence Address', required: false },
    { id: 'emergency', label: 'Emergency Address', required: false },
    { id: 'temporary', label: 'Temporary Address', required: false }
  ];

  addressFields: AddressField[] = [
    {
      id: 'addressLineOne',
      label: 'Address Line 1',
      required: true,
      type: 'text'
    },
    {
      id: 'pinCode',
      label: 'Pincode',
      required: true,
      type: 'number',
      validators: [
        Validators.pattern('^[0-9]{6}$'),
        Validators.minLength(6),
        Validators.maxLength(6)
      ],
      maxLength: 6,
    },
    {
      id: 'state',
      label: 'State',
      required: true,
      type: 'select',
      options: this.stateOptions
    },
    {
      id: 'country',
      label: 'Country',
      required: true,
      type: 'select',
      options: this.countryOptions
    }
  ];

  errorMessages = {
    addressLineOne: {
      required: 'Please provide your address line 1',
    },
    pinCode: {
      required: 'PIN code is mandatory',
      pattern: 'Please enter a valid 6-digit PIN code',
      maxlength: 'PIN code must be exactly 6 digits'
    },
    state: {
      required: 'Please select your state from the list'
    },
    country: {
      required: 'Please select your country from the list'
    },
    ionRadio: {
      required: 'Please select an option'
    }
  };

  // showCurrentAddressCheckbox = false;

  constructor(
    private formBuilder: FormBuilder,
    private alertController: AlertController,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {
    this.mainForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      age: ['', [Validators.required, Validators.min(0)]],
      lastName: ['', Validators.required],
      gender: ['', Validators.required]
    });

    // this.initializeAddressTypes();
    this.mainForm.valueChanges.subscribe(() => {
      this.cdr.markForCheck();
    });
  }

  // private initializeAddressTypes() {
  //   // this.showCurrentAddressCheckbox = true;
  // }

  handleAddressChange(addressData: any) {
    this.addressDetails = addressData;
    this.cdr.markForCheck();
  }

  validateAddressDetails(): boolean {
    if (!this.addressDetails) return false;

    const requiredAddressTypes = this.addressTypes
      .filter(type => type.required)
      .map(type => type.id);

    return requiredAddressTypes.every(type => {
      const address = this.addressDetails[type];
      const requiredFields = this.addressFields
        .filter(field => field.required)
        .map(field => field.id);

      return address && requiredFields.every(fieldId => address[fieldId]);
    });
  }

  async submitForm() {
    Object.keys(this.mainForm.controls).forEach(key => {
      const control = this.mainForm.get(key);
      control?.markAsTouched();
    });
    this.addressComponent.markAllFieldsAsTouched();
    if (!this.mainForm.valid || !this.validateAddressDetails()) {
      await this.showAlert('Form Submission Failed', 'Please fill in all required fields before submitting.');
      this.cdr.markForCheck();
      return;
    }
  
    const { firstName, age, lastName, gender } = this.mainForm.value;
  
    const formData = {
      personalDetails: { firstName, age, lastName, gender },
      addressDetails: this.addressDetails,
    };
  
    console.log('Form Submission Successful:', formData);
    this.router.navigate(['/successful']);
  }

  async showAlert(headerText: string, messageText: string): Promise<void> {
    const alert = await this.alertController.create({
      header: headerText,
      message: messageText,
      buttons: ['OK'],
      cssClass: 'customAlert'
    });

    await alert.present();
  }

  closePage() {
    console.log("go to welcome page");
    this.router.navigate(['/frontpage']);
  }

  ionViewWillLeave() {
    this.mainForm.reset();
    this.addressDetails = null;
    if (this.addressComponent) {
      this.addressComponent.resetForm();
    }
    this.cdr.markForCheck();
    console.log('Form cleared on page leave');
  }
}