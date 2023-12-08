import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CartesPage } from './cartes.page';

describe('CartesPage', () => {
  let component: CartesPage;
  let fixture: ComponentFixture<CartesPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(CartesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
