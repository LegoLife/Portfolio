import {Component, OnInit} from '@angular/core';
import Enumerable from "linq";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements  OnInit{
  ngOnInit(): void {
    Enumerable.from(document.getElementsByTagName("img")).forEach(x=>{
      if(x.alt ==="www.000webhost.com")
        x.remove();
    })
    }

}
