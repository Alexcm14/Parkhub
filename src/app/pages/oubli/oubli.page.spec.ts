import { ComponentFixture, TestBed, async } from '@angular/core/testing';
import { OubliPage } from './oubli.page';

describe('OubliPage', () => {
  let component: OubliPage;
  let fixture: ComponentFixture<OubliPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(OubliPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
