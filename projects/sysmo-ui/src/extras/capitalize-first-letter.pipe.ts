import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'capitalizeFirstLetter',
})
export class CapitalizeFirstLetterPipe implements PipeTransform {
  transform(value: string): string {
    if (!value) return value;
    // Capitalize the first letter and  the rest of the string lowercase
    let result = value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
    return result;
  }
}
