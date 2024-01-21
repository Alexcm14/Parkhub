import { Component } from '@angular/core';
import { register } from 'swiper/element/bundle';
import{IonicModule} from '@ionic/angular';
import{TranslateService} from '@ngx-translate/core';

register();

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  IonicModule

  constructor(private translate:TranslateService) {}
}
