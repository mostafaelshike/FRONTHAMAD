import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Conect } from './conect';

describe('Conect', () => {
  let component: Conect;
  let fixture: ComponentFixture<Conect>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Conect]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Conect);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
