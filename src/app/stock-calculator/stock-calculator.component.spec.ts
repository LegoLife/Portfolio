import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StockCalculatorComponent } from './stock-calculator.component';

describe('StockCalculatorComponent', () => {
  let component: StockCalculatorComponent;
  let fixture: ComponentFixture<StockCalculatorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StockCalculatorComponent]
    });
    fixture = TestBed.createComponent(StockCalculatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
