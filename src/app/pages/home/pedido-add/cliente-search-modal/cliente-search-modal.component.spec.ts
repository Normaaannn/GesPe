import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ClienteSearchModalComponent } from './cliente-search-modal.component';

describe('ClienteSearchModalComponent', () => {
  let component: ClienteSearchModalComponent;
  let fixture: ComponentFixture<ClienteSearchModalComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [ClienteSearchModalComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ClienteSearchModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
