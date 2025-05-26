import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CambiarLogoEmpresaPage } from './cambiar-logo-empresa.page';

describe('CambiarLogoEmpresaPage', () => {
  let component: CambiarLogoEmpresaPage;
  let fixture: ComponentFixture<CambiarLogoEmpresaPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CambiarLogoEmpresaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
