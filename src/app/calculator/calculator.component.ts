import { HostListener,Component } from '@angular/core';




@Component({
  selector: 'app-calculator',
  templateUrl: './calculator.component.html',
  styleUrls: ['./calculator.component.css']
})
export class CalculatorComponent {
  acceptedInputs = [".","0", "1", "2", "3", "4", "5", "6", "7", "8", "9","-", "+", "/", "*","="];

  input = '';
  result = '';
  constructor() {
  }
  @HostListener('document:keydown', ['$event'])
  handleTheKeyboardEvent(event: KeyboardEvent) {
    if(!this.acceptedInputs.includes(event.key))
      return;

    this.handleClick(event.key);
  }
  handleClick(value: string) {
    if (value === '=') {
      try {
        // Use the eval function to calculate the result
        //this.result = eval(this.input);
        this.input=eval(this.input);
      } catch (error) {
        this.result = 'Error';
      }
    } else if (value === 'C') {
      // Clear the input and result
      this.input = '';
      this.result = '';
    } else {
      // Append the clicked button value to the input
      this.input += value;
    }
  }
}
