import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModificationPage } from './modification.page';

describe('ModificationPage', () => {
  let component: ModificationPage;
  let fixture: ComponentFixture<ModificationPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(ModificationPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
