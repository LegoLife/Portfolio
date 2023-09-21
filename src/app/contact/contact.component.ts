import { Component } from '@angular/core';
import {faCoffee} from "@fortawesome/free-solid-svg-icons";

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent {

  protected readonly faCoffee = faCoffee;
}
