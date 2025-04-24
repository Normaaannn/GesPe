import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ProductoSearchModalComponent } from './producto-search-modal.component';

describe('ProductoSearchModalComponent', () => {
  let component: ProductoSearchModalComponent;
  let fixture: ComponentFixture<ProductoSearchModalComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [ProductoSearchModalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductoSearchModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
