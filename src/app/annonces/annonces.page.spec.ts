import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { AnnoncesPage } from './annonces.page';

describe('AnnoncesPage', () => {
  let component: AnnoncesPage;
  let fixture: ComponentFixture<AnnoncesPage>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AnnoncesPage ],
      // Ajoutez ici d'autres configurations nécessaires pour votre test
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnnoncesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

