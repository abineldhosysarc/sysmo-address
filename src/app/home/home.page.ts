// home.ts
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

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
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage {
  mainForm: FormGroup;
  addressDetails: any;

  addressTypes: AddressType[] = [
    { id: 'currentAddress', label: 'Current Address', required: true },
    { id: 'permanentAddress', label: 'Permanent Address', required: true },
    // { id: 'aadharAddress', label: 'Aadhar Address', required: false },
    // { id: 'officeAddress', label: 'Office Address', required: false }
  ];

  addressFields: AddressField[] = [
    {
      id: 'address1',
      label: 'Address Line 1',
      required: true,
      type: 'text'
    },
    {
      id: 'address2',
      label: 'Address Line 2',
      required: false,
      type: 'text'
    },
    {
      id: 'address3',
      label: 'Address Line 3',
      required: false,
      type: 'text'
    },
    {
      id: 'pincode',
      label: 'Pincode',
      required: true,
      type: 'number',
      validators: [Validators.pattern('^[0-9]{6}$')],
      maxLength: 6
    },
    {
      id: 'state',
      label: 'State',
      required: true,
      type: 'text'
    },
  
  {
    id: 'country',
    label: 'country',
    required: true,
    type: 'text'
  }
  ];

  showCurrentAddressCheckbox = false;

  constructor(
    private fb: FormBuilder,
    private alertCtrl: AlertController,
    private router: Router
  ) {
    this.mainForm = this.fb.group({
      firstName: ['', Validators.required],
      age: ['', [Validators.required, Validators.min(0)]],
      lastName: ['', Validators.required],
      gender: ['', Validators.required]
    });

    this.initializeAddressTypes();
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
      await this.showAlert('Form Submission Failed','Please fill in all required fields before submitting.');
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

  async showAlert(header: string, message: string): Promise<void> {
    const alert = await this.alertCtrl.create({
      header,
      message,
      buttons: ['OK'],
      cssClass: 'custom-alert'
    });

    await alert.present();
  }

  closePage() {
    console.log("go to welcome page");
    this.router.navigate(['/frontpage']);
  }
}