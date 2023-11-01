import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EstimationPage } from './estimation.page';

describe('EstimationPage', () => {
  let component: EstimationPage;
  let fixture: ComponentFixture<EstimationPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(EstimationPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
