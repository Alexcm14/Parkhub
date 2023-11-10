import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LocalisationPage } from './localisation.page';

describe('LocalisationPage', () => {
  let component: LocalisationPage;
  let fixture: ComponentFixture<LocalisationPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(LocalisationPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
