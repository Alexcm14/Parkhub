import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tab5',
  templateUrl: './tab5.page.html',
  styleUrls: ['./tab5.page.scss'],
})
export class Tab5Page implements OnInit {

  constructor(private router:Router) { }

  ngOnInit() {
  }
  goPersonal() {
    this.router.navigate(['/personal']);
};
}