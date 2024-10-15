import { Component } from '@angular/core';

interface Investment {
  principal: number;
  annualRate: number;
  years: number;
  monthlyContribution: number;
  futureValue?: number;
}

@Component({
  selector: 'app-investment-calculator',
  templateUrl: './investment-calculator.component.html',
  styleUrls: ['./investment-calculator.component.css']
})
export class InvestmentCalculatorComponent {
  investments: Investment[] = [
    { principal: 1000, annualRate: 5, years: 10, monthlyContribution: 0 },
  ];

  totalFutureValue: number=0;


  calculateFutureValue(investment: Investment): number {
    const { principal, annualRate, years, monthlyContribution } = investment;
    const r = annualRate / 100;
    const n = 12;
    const t = years;

    const futureValue =
      principal * Math.pow(1 + r / n, n * t) +
      (monthlyContribution * (Math.pow(1 + r / n, n * t) - 1)) / (r / n);

    return futureValue;
  }

  calculateAll() {
    this.totalFutureValue= 0;
    this.investments.forEach((inv) => {
      inv.futureValue = this.calculateFutureValue(inv);
      this.totalFutureValue += inv.futureValue;
    });

    const elements = document.getElementsByClassName('combinedTotal');
    const element = elements[0] as HTMLElement;

    element.style.backgroundColor = 'lightgreen';

    setTimeout(() => {
      element.style.backgroundColor = '';
    }, 2000);
  }

  addInvestment() {
    this.investments.push({ principal: 1000, annualRate: 5, years: 10, monthlyContribution: 0 });
  }
  clearAll(){
    this.investments = [];
  }

  removeInvestment(param: number) {
    let investment = this.investments[param];

    this.investments.splice(param,1)
  }
}
