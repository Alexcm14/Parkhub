import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatTimer'
})
export class FormatTimerPipe implements PipeTransform {
  transform(value: number): string {
    if (!value && value !== 0) return '0:00'; // Retourner une valeur par défaut si la valeur est indéfinie ou NaN
  
    const minutes: number = Math.floor(value / 60);
    const seconds: number = value % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  }}