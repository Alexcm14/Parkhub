import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PrixPage } from './prix.page';

describe('PrixPage', () => {
  let component: PrixPage;
  let fixture: ComponentFixture<PrixPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(PrixPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
