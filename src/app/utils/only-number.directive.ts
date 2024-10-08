import { Directive, ElementRef, HostListener, Input } from '@angular/core';
import { allowedCodes, allowedKeys } from './utils';

@Directive({
  standalone: true,
  selector: '[s11OnlyNumber]',
})
export class OnlyNumber {
  constructor(private el: ElementRef) {}

  @Input() s11OnlyNumber: boolean = true;
  @Input() s11AdditionalAllowedCharacters: string[] = [];

  @HostListener('keydown', ['$event']) onKeyDown(event: KeyboardEvent) {
    const code = event.code;
    const key = event.key;

    console.warn(event.code);
    if (this.s11OnlyNumber) {
      if (
        !(allowedCodes.includes(code) || allowedKeys.includes(key)) &&
        !this.s11AdditionalAllowedCharacters.includes(code)
      ) {
        event.preventDefault();
      }
    }
  }
}
