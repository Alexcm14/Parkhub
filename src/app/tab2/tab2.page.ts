import { Component } from '@angular/core';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {

  messageSenders = [
    {
      name: 'John Doe',
      lastMessage: 'Salut, comment ça va ?',
      
    },
    {
      name: 'Jane Smith',
      lastMessage: 'Quoi de neuf ?',
    
    },
    // Ajoutez d'autres personnes selon vos besoins
  ];
  
  constructor() {}



}

