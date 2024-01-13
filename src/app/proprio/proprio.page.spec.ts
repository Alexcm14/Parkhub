import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProprioPage } from './proprio.page';

describe('ProprioPage', () => {
  let component: ProprioPage;
  let fixture: ComponentFixture<ProprioPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ProprioPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
