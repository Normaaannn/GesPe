import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PedidoAddPage } from './pedido-add.page';

describe('PedidoAddPage', () => {
  let component: PedidoAddPage;
  let fixture: ComponentFixture<PedidoAddPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PedidoAddPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
