import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RecapitulatifPage } from './recapitulatif.page';

describe('RecapitulatifPage', () => {
  let component: RecapitulatifPage;
  let fixture: ComponentFixture<RecapitulatifPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(RecapitulatifPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
