// data.service.ts

import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private cardData = new BehaviorSubject<any>(null);
  cardData$ = this.cardData.asObservable();

  setCardData(data: any) {
    this.cardData.next(data);
  }
}
