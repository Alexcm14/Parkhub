import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AnnoncesPage } from './annonces.page';

describe('AnnoncesPage', () => {
  let component: AnnoncesPage;
  let fixture: ComponentFixture<AnnoncesPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(AnnoncesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
