import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ResPage } from './res.page';

describe('ResPage', () => {
  let component: ResPage;
  let fixture: ComponentFixture<ResPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ResPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
