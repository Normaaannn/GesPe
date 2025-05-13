import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InfoEmpresaPage } from './info-empresa.page';

describe('InfoEmpresaPage', () => {
  let component: InfoEmpresaPage;
  let fixture: ComponentFixture<InfoEmpresaPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(InfoEmpresaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
