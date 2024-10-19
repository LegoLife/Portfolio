import { Component } from '@angular/core';

interface Investment {
  principal: string;
  annualRate: number;
  years: number;
  monthlyContribution: string;
  futureValue?: number;
}

@Component({
  selector: 'app-investment-calculator',
  templateUrl: './investment-calculator.component.html',
  styleUrls: ['./investment-calculator.component.css']
})
export class InvestmentCalculatorComponent {
  investments: Investment[] = [
    { principal: "1,000", annualRate: 5, years: 10, monthlyContribution: "0" },
  ];

  totalFutureValue: number=0;
















  calculateFutureValue(investment: Investment): number {
    const principal = parseFloat(investment.principal.replace(/,/g, '')) || 0;
    const monthlyContribution = parseFloat(investment.monthlyContribution.replace(/,/g, '')) || 0;
    const annualRate = investment.annualRate / 100;
    const years = investment.years;

    const futureValuePrincipal = principal * Math.pow(1 + annualRate, years);

    let futureValueContributions = 0;
    for (let year = 1; year <= years; year++) {
      const contributionsForYear = monthlyContribution * 12;
      futureValueContributions += contributionsForYear * Math.pow(1 + annualRate, years - year);
    }

    return futureValuePrincipal + futureValueContributions;
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
    this.investments.push({ principal: "1,000", annualRate: 5, years: 10, monthlyContribution: "0" });
  }
  clearAll(){
    this.investments = [];
  }

  removeInvestment(param: number) {
    let investment = this.investments[param];

    this.investments.splice(param,1)
  }

  formatPrincipal(event: any, index: number) {
    let value = event.target.value.replace(/,/g, '');
    const formattedValue = parseFloat(value).toLocaleString('en-US');
    this.investments[index].principal = formattedValue;
  }
  formatMonthlyContribution(event: any, index: number) {
    let value = event.target.value.replace(/,/g, '');
    const formattedValue = parseFloat(value).toLocaleString('en-US');
    this.investments[index].monthlyContribution = formattedValue;
  }

  duplicateInvestment(index: number) {
    const investmentCopy = { ...this.investments[index] };
    this.investments.push(investmentCopy);
  }
}
