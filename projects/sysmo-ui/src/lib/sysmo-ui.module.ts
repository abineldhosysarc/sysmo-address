import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SysmoAddress } from './sysmoui-address.component';
import { SysmoGender } from './sysmoui-gender.component';
import { SysmoDob } from './sysmoui-dob.component';
import { AgeCalculatorPipe } from './pipes/age-calculator.pipe';

@NgModule({
    declarations: [],  // Move it here
    imports: [
    CommonModule,
    IonicModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
    SysmoAddress,
    SysmoGender,AgeCalculatorPipe,SysmoDob
  ],
  exports: [
    SysmoAddress,SysmoGender,SysmoDob
  ]
})
export class SysmoUIModule { }