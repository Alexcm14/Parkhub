import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Config1Page } from './config1.page';

describe('Config1Page', () => {
  let component: Config1Page;
  let fixture: ComponentFixture<Config1Page>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(Config1Page);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
