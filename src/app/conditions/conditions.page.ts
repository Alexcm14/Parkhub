import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';

@Component({
  selector: 'app-conditions',
  templateUrl: './conditions.page.html',
  styleUrls: ['./conditions.page.scss'],
})
export class ConditionsPage implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }

  acceptTerms() {
    // Définir la clé 'readenTerms' dans localStorage
    localStorage.setItem('readenTerms', 'true');
    // Rediriger l'utilisateur vers la page souhaitée après l'acceptation
     this.router.navigate(['tabs/tab1']);
  }
}


