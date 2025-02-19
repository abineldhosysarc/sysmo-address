import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { SysmoAddress, SysmoGender, SysmoDob } from 'sysmo-ui';

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
  selector: 'app-frontpage',
  templateUrl: './frontpage.page.html',
  styleUrls: ['./frontpage.page.scss'],
    standalone: true,
    imports: [IonicModule, SysmoAddress,SysmoGender,SysmoDob]
})
export class FrontpagePage implements OnInit {

 
  addressTypes: AddressType[] = [
    { id: 'current', label: 'Current Address', required: true },
    { id: 'permanent', label: 'Permanent Address', required: true },
    { id: 'aadhar', label: 'Aadhar Address', required: false },
    { id: 'office', label: 'Office Address', required: false },
    { id: 'correspondence', label: 'Correspondence Address', required: false },
    { id: 'emergency', label: 'Emergency Address', required: false },
    { id: 'temporary', label: 'Temporary Address', required: false }
  ];

  constructor(private router: Router) { }

  ngOnInit() {
  }
  goHome(){
    this.router.navigate(['/home']);
  }
}
