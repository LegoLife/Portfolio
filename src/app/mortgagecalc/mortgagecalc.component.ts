import { Component } from '@angular/core';
//import {MatSliderModule} from '@angular/material/slider';

@Component({
  selector: 'app-mortgagecalc',
  templateUrl: './mortgagecalc.component.html',
  styleUrls: ['./mortgagecalc.component.css']
})
export class MortgagecalcComponent {
  loanAmount: number = 200000; // Initial loan amount
  interestRate: number = 4.5; // Annual interest rate (as a percentage)
  loanTerm: number = 30; // Loan term in years
  monthlyPayment: number=0;

  calculateMonthlyPayment() {
    const monthlyInterestRate = this.interestRate / 100 / 12;
    const totalPayments = this.loanTerm * 12;
    const base = Math.pow(1 + monthlyInterestRate, totalPayments);
    this.monthlyPayment = (this.loanAmount * monthlyInterestRate * base) / (base - 1);
  }


  formatLoanAmount() {
    // Remove commas and reformat the loanAmount
    this.loanAmount = parseFloat(this.loanAmount.toString().replace(/,/g, ''));
  }
}
