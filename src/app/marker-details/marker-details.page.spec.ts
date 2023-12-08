import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MarkerDetailsPage } from './marker-details.page';

describe('MarkerDetailsPage', () => {
  let component: MarkerDetailsPage;
  let fixture: ComponentFixture<MarkerDetailsPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(MarkerDetailsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
