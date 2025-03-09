import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-stock-calculator',
  templateUrl: './stock-calculator.component.html',
  styleUrls: ['./stock-calculator.component.css']
})
export class StockCalculatorComponent implements OnInit {
  @ViewChild('chartCanvas') chartCanvas!: ElementRef;
  startingBalance: number = 20000;
  initialPrice: number = 262.67;
  projectedPrice: number = 12000;
  years: number = 10;
  monthlyInvestment: number = 600;

  cagr: number | null = null;
  totalShares: number | null = null;
  totalInvestment: number | null = null;
  finalValue: number | null = null;
  profit: number | null = null;

  showGraph: boolean = false;
  private chart: Chart | null = null;

  ngOnInit() {
    this.calculateResults();
  }

  ngDoCheck() {
    this.calculateResults();
    if (this.showGraph && this.chart) {
      this.updateChart();
    }
  }

  toggleGraph() {
    this.showGraph = !this.showGraph;
    if (this.showGraph) {
      setTimeout(() => this.createChart(), 0); // Wait for DOM update
    } else if (this.chart) {
      this.chart.destroy();
      this.chart = null;
    }
  }

  calculateResults() {
    if (this.initialPrice > 0 && this.projectedPrice > 0 && this.years > 0) {
      this.cagr = (Math.pow(this.projectedPrice / this.initialPrice, 1 / this.years) - 1) * 100;

      const totalMonths = this.years * 12;
      const monthlyGrowthRate = Math.pow(1 + (this.cagr / 100), 1 / 12) - 1;
      let currentShares = this.startingBalance / this.initialPrice; // Initial shares from starting balance
      let currentValue = this.startingBalance;

      for (let month = 0; month < totalMonths; month++) {
        currentShares += this.monthlyInvestment / this.initialPrice;
        const currentPrice = this.initialPrice * Math.pow(1 + monthlyGrowthRate, month + 1);
        currentValue = currentShares * currentPrice;
      }

      this.totalShares = currentShares;
      this.totalInvestment = this.startingBalance + (this.monthlyInvestment * totalMonths);
      this.finalValue = currentValue;
      this.profit = this.finalValue - this.totalInvestment;
    } else {
      this.cagr = null;
      this.totalShares = null;
      this.totalInvestment = null;
      this.finalValue = null;
      this.profit = null;
    }
  }

  formatNumberWithCommas(value: number): string {
    return value.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  }

  createChart() {
    if (!this.chartCanvas || this.finalValue === null || this.totalInvestment === null) return;

    const ctx = this.chartCanvas.nativeElement.getContext('2d');
    const dataPoints = this.generateValueGrowthData();

    this.chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: dataPoints.map(point => point.year),
        datasets: [
          {
            label: 'Total Value ($)',
            data: dataPoints.map(point => point.value),
            borderColor: '#007bff',
            tension: 0.1,
            fill: false
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: { title: { display: true, text: 'Years' } },
          y: {
            title: { display: true, text: 'Value ($)' },
            ticks: {
              callback: (value) => '$' + this.formatNumberWithCommas(Number(value))
            }
          }
        },
        plugins: {
          tooltip: {
            callbacks: {
              label: (context) => {
                let label = context.dataset.label || '';
                if (label) {
                  label += ': ';
                }
                label += '$' + this.formatNumberWithCommas(context.parsed.y);
                return label;
              }
            }
          }
        }
      }
    });
  }

  updateChart() {
    if (this.chart && this.finalValue !== null && this.totalInvestment !== null) {
      const dataPoints = this.generateValueGrowthData();
      this.chart.data.labels = dataPoints.map(point => point.year);
      this.chart.data.datasets[0].data = dataPoints.map(point => point.value);
      this.chart.update();
    }
  }

  generateValueGrowthData() {
    const dataPoints = [];
    const monthlyGrowthRate = this.cagr ? Math.pow(1 + (this.cagr / 100), 1 / 12) - 1 : 0;
    let currentShares = this.startingBalance / this.initialPrice; // Initial shares from starting balance
    let currentValue = this.startingBalance;

    for (let month = 0; month <= this.years * 12; month++) {
      if (month % 12 === 0) { // Record yearly points
        const year = month / 12;
        dataPoints.push({
          year: year,
          value: Number(currentValue.toFixed(2))
        });
      }

      if (month < this.years * 12) {
        currentShares += this.monthlyInvestment / this.initialPrice;
        const currentPrice = this.initialPrice * Math.pow(1 + monthlyGrowthRate, month + 1);
        currentValue = currentShares * currentPrice;
      }
    }

    return dataPoints;
  }
}
