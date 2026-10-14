import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Catogrey } from './catogrey';

describe('Catogrey', () => {
  let component: Catogrey;
  let fixture: ComponentFixture<Catogrey>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Catogrey]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Catogrey);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
