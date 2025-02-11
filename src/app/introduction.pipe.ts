import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'introduction',
  standalone: true
})
export class IntroductionPipe implements PipeTransform {

  transform(value: unknown, ...args: unknown[]): unknown {
    return null;
  }

}
