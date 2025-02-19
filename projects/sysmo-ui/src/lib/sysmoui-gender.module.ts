import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SysmouiGenderComponent } from './sysmoui-gender.component';
 
@NgModule({
    declarations: [],
    imports: [
    CommonModule,
    IonicModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
    SysmouiGenderComponent
  ],
  exports: [
    SysmouiGenderComponent
  ]
})
export class SysmouiGenderModule { }