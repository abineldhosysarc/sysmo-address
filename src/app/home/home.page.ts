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
  addressTypes: AddressType[] = [
    { id: 'currentAddress', label: 'Current Address', required: true },
    { id: 'permanentAddress', label: 'Permanent Address', required: true },
    // { id: 'aadharAddress', label: 'Aadhar Address', required: false },
    // { id: 'officeAddress', label: 'Office Address', required: false }
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

  showCurrentAddressCheckbox = false;

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

    this.initializeAddressTypes();
    this.mainForm.valueChanges.subscribe(() => {
      this.cdr.markForCheck();
    });
  }

  private initializeAddressTypes() {
    this.showCurrentAddressCheckbox = this.addressTypes.length >= 2;
  }

  handleAddressChange(addressData: any) {
    this.addressDetails = addressData;
    console.log('Address Data:', addressData);
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