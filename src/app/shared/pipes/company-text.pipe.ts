import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'ct' })
export class CompanyTextPipe implements PipeTransform {
  transform(key: string, fallback: string): string {
    return fallback;
  }
}
