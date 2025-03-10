import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HomePage } from './home.page';

import { HomePageRoutingModule } from './home-routing.module';
import { SysmoAddressComponent } from '../sysmo-address/sysmo-address.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,ReactiveFormsModule,
    HomePageRoutingModule, SysmoAddressComponent
  ],
  declarations: [HomePage]
})
export class HomePageModule {}
