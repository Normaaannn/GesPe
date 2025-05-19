import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CambiarAvatarPage } from './cambiar-avatar.page';

describe('CambiarAvatarPage', () => {
  let component: CambiarAvatarPage;
  let fixture: ComponentFixture<CambiarAvatarPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CambiarAvatarPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
