import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductoAddPage } from './producto-add.page';

describe('ProductoAddPage', () => {
  let component: ProductoAddPage;
  let fixture: ComponentFixture<ProductoAddPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductoAddPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
