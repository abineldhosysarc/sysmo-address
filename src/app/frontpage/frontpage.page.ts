import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-frontpage',
  templateUrl: './frontpage.page.html',
  styleUrls: ['./frontpage.page.scss'],
    standalone: true,
    imports: [IonicModule]
})
export class FrontpagePage implements OnInit {
  constructor(private router: Router) { }

  ngOnInit() {
  }
  goHome(){
    this.router.navigate(['/home']);
  }
}
