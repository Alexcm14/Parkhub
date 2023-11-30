import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PaypopupPage } from './paypopup.page';

describe('PaypopupPage', () => {
  let component: PaypopupPage;
  let fixture: ComponentFixture<PaypopupPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(PaypopupPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
