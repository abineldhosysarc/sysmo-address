import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-successful',
  templateUrl: './successful.page.html',
  styleUrls: ['./successful.page.scss'],
  standalone: true,
  imports: [IonicModule]
})
export class SuccessfulPage implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }
  goHome(){
    this.router.navigate(['/frontpage']);
  }
}
