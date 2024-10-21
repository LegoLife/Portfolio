import {Component, ElementRef, QueryList, ViewChildren} from '@angular/core';
import Chart from 'chart.js/auto';

interface YearlyBreakdown {
  year: number;
  principal: number;
  interest: number;
  total: number;

}
interface Investment {
  principal: string;
  annualRate: number;
  years: number;
  monthlyContribution: string;
  futureValue?: number;
  yearlyBreakdown?: YearlyBreakdown[];

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
  @ViewChildren('chartCanvas') chartCanvases!: QueryList<ElementRef>;

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
      inv.yearlyBreakdown = this.calculateYearlyBreakdown(inv);
      this.totalFutureValue += inv.futureValue;
    });

    const elements = document.getElementsByClassName('combinedTotal');
    const element = elements[0] as HTMLElement;

    element.style.backgroundColor = 'lightgreen';

    setTimeout(() => {
      element.style.backgroundColor = '';
    }, 2000);
  }

  calculateYearlyBreakdown(investment: Investment): YearlyBreakdown[] {
    const principal = parseFloat(investment.principal.replace(/,/g, '')) || 0;
    const monthlyContribution = parseFloat(investment.monthlyContribution.replace(/,/g, '')) || 0;
    const annualRate = investment.annualRate / 100;
    const years = investment.years;

    let breakdown: YearlyBreakdown[] = [];
    let totalPrincipal = principal;
    let total = principal;

    for (let year = 1; year <= years; year++) {
      const interest = total * annualRate;
      total += interest + monthlyContribution * 12;
      totalPrincipal += monthlyContribution * 12;

      breakdown.push({
        year,
        principal: totalPrincipal,
        interest,
        total
      });
    }

    return breakdown;
  }


  onDetailsToggle(event: any, investment: any, index: number) {
    if (event.target.open) {
      const canvas = this.chartCanvases.toArray()[index].nativeElement;
      this.initializeChart(investment, canvas);
    }
  }

  initializeChart(investment: Investment, chartElement: HTMLCanvasElement) {
    if (investment.yearlyBreakdown) {
      const labels = investment.yearlyBreakdown.map((y) => `Year ${y.year}`);
      const principalData = investment.yearlyBreakdown.map((y) => y.principal);
      const interestData = investment.yearlyBreakdown.map((y) => y.interest);
      const totalData = investment.yearlyBreakdown.map((y) => y.total);

      new Chart(chartElement, {
        type: 'line',
        data: {
          labels,
          datasets: [
            { label: 'Principal', data: principalData, borderColor: 'blue', fill: false },
            { label: 'Interest', data: interestData, borderColor: 'green', fill: false },
            { label: 'Total', data: totalData, borderColor: 'red', fill: false }
          ]
        },
        options: {
          responsive: true,
          plugins: {
            legend: { position: 'top' },
            tooltip: { enabled: true }
          }
        }
      });
    }
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
