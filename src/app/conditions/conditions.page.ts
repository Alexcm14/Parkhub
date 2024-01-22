import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from 'src/app/language.service';


@Component({
  selector: 'app-conditions',
  templateUrl: './conditions.page.html',
  styleUrls: ['./conditions.page.scss'],
})
export class ConditionsPage implements OnInit {
  selectedLanguage: string = 'fr';
  

    private languageService: LanguageService,  private translateService: TranslateService,private router: Router) { }

  ngOnInit() {this.languageService.selectedLanguage$.subscribe((language) => {
    this.selectedLanguage = language;
    this.translateService.use(language);
  });
  }

    localStorage.setItem('readenTerms', 'true');
  }

  changeLanguage() {
    this.languageService.setLanguage(this.selectedLanguage);
  }

}

