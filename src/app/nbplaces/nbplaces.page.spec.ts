import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NbplacesPage } from './nbplaces.page';

describe('NbplacesPage', () => {
  let component: NbplacesPage;
  let fixture: ComponentFixture<NbplacesPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(NbplacesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
