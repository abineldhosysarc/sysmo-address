import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  input,
  Input,
  OnInit,
} from '@angular/core';
import {
  IonAvatar,
  IonChip,
  IonContent,
  IonLabel,
} from '@ionic/angular/standalone';
import { Genders } from './gender.model';
import { CustomStyleSheet } from './stylesheet.model';
import { IconService } from '../shared/icon.service';

@Component({
  selector: 'sysmo-gender',
  templateUrl: './sysmo-gender.component.html',
  styleUrls: ['./sysmo-gender.component.scss'],
  imports: [IonChip, IonLabel, IonAvatar, CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SysmoGenderComponent implements OnInit {
  @Input() gender: string = ''; // Optionally disabled the gender field
  // Input for array of an user objects with gender, icon and titles
  @Input() users: Array<Genders> = [];
  // Input to custom styles for gender
  @Input() genderStyleProps?: CustomStyleSheet;

  constructor(private iconService: IconService) {}

  ngOnInit(): void {}
  // Method returns the icon based on gender
  getGenderIcon(icon: string): string {
    return this.iconService.getIconUrl(icon);
  }

  // Method returns the label based on gender
  getGenderLabel(gender: string): string {
    return gender;
  }

  // Method checks the index and disables the gender
  shouldDisableGender(nIndex: number): boolean {
    // Compare the gender of the current user with the input gender.
    return (
      this.users[nIndex].gender.toLowerCase() !== this.gender.toLowerCase()
    );
  }
}
