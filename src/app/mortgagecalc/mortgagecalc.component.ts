import { Component } from '@angular/core';


@Component({
  selector: 'app-mortgagecalc',
  templateUrl: './mortgagecalc.component.html',
  styleUrls: ['./mortgagecalc.component.css']
})
export class MortgagecalcComponent {
  loanAmount: number = 200000;
  interestRate: number = 4.5;
  loanTerm: number = 30;
  monthlyPayment: number=0;

  calculateMonthlyPayment() {
    const monthlyInterestRate = this.interestRate / 100 / 12;
    const totalPayments = this.loanTerm * 12;
    const base = Math.pow(1 + monthlyInterestRate, totalPayments);
    this.monthlyPayment = (this.loanAmount * monthlyInterestRate * base) / (base - 1);
  }


  formatLoanAmount() {

    this.loanAmount = parseFloat(this.loanAmount.toString().replace(/,/g, ''));
  }
}
