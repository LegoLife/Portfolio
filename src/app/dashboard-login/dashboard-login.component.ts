import {Component, OnInit} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {faker} from "@faker-js/faker";
import Enumerable from "linq";
import {Router} from "@angular/router";

@Component({
  selector: 'app-dashboard-login',
  templateUrl: './dashboard-login.component.html',
  styleUrls: ['./dashboard-login.component.css']
})
export class DashboardLoginComponent implements OnInit{
  tokenUrl:string = "https://dummyjson.com/auth/login";
  postHeaders: HttpHeaders = new HttpHeaders();
  users: User[]=[];
  userName:string="admin";

  constructor(private http: HttpClient,private router:Router) {

  }


  ngOnInit(): void {
     this.http.get<Data>("https://dummyjson.com/users").subscribe((x) =>
     {
       this.users = x.users;
      });
  }
  submit(){
    this.postHeaders.set('Content-Type', 'application/json');
    let loginUser = faker.helpers.arrayElement<User>(this.users);
    this.http.post(this.tokenUrl,{username:loginUser.username,password:loginUser.password},{headers:this.postHeaders}).subscribe(x=>{
      sessionStorage.setItem("username",this.userName);
      this.router.navigate(["/dashboard"]);
    })
  }


}

export interface Data {
  users: User[]
  total: number
  skip: number
  limit: number
}

export interface User {
  id: number
  firstName: string
  lastName: string
  maidenName: string
  age: number
  gender: string
  email: string
  phone: string
  username: string
  password: string
  birthDate: string
  image: string
  bloodGroup: string
  height: number
  weight: number
  eyeColor: string
  hair: Hair
  domain: string
  ip: string
  address: Address
  macAddress: string
  university: string
  bank: Bank
  company: Company
  ein: string
  ssn: string
  userAgent: string
}

export interface Hair {
  color: string
  type: string
}

export interface Address {
  address: string
  city: string
  coordinates: Coordinates
  postalCode: string
  state: string
}

export interface Coordinates {
  lat: number
  lng: number
}

export interface Bank {
  cardExpire: string
  cardNumber: string
  cardType: string
  currency: string
  iban: string
}

export interface Company {
  address: Address2
  department: string
  name: string
  title: string
}

export interface Address2 {
  address: string
  city: string
  coordinates: Coordinates2
  postalCode: string
  state: string
}

export interface Coordinates2 {
  lat: number
  lng: number
}



