import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MortgagecalcComponent } from './mortgagecalc.component';

describe('MortgagecalcComponent', () => {
  let component: MortgagecalcComponent;
  let fixture: ComponentFixture<MortgagecalcComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MortgagecalcComponent]
    });
    fixture = TestBed.createComponent(MortgagecalcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
