import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FrontpagePageRoutingModule } from './frontpage-routing.module';

import { SysmoAddress, SysmoDob, SysmoGender, } from 'sysmo-ui';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FrontpagePageRoutingModule,
    SysmoAddress,SysmoGender,SysmoDob
  ],
})
export class FrontpagePageModule {}
