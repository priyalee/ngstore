import { Pipe, PipeTransform } from '@angular/core';
import { TranslationService } from '@core/services/translation.service';

@Pipe({
  name: 'translate',
  standalone: true,
  pure: false, // re-evaluates when the active language changes
})
export class TranslatePipe implements PipeTransform {
  constructor(private t: TranslationService) {}

  transform(key: string): string {
    return this.t.translate(key);
  }
}
