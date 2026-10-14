import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailsProduct } from './details-product';

describe('DetailsProduct', () => {
  let component: DetailsProduct;
  let fixture: ComponentFixture<DetailsProduct>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DetailsProduct]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailsProduct);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
