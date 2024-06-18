import {AfterViewInit, Component, OnInit} from '@angular/core';
import {Chart} from "chart.js";
import Enumerable from "linq";
import {faker} from "@faker-js/faker";
import {Customer, Order, Product, ProductData} from "../../dto/Order";
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";
import {UserData} from "../../dto/Users";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, AfterViewInit{
  public barchart: any={};
  public linechart:any={};
  public orderData:Order[]=[];
  user: any= sessionStorage.getItem("username");
  homeSelected: boolean=true;
  usersSelected:boolean=false;
  productsSelected:boolean=false;
  ordersSelected: boolean=false;

  ordersDtOptions: DataTables.Settings = {};
  productDtOptions:DataTables.Settings={};
  userDtOptions:DataTables.Settings={};
  imageTransform = 'scale(1)';
  // @ts-ignore
  productData:ProductData;
  // @ts-ignore
  userData:UserData;


  ngOnInit(): void {

    this.createOrderData();


    this.http.get<ProductData>("https://dummyjson.com/products").subscribe(x=>{
      this.productData = x;

    })

    this.http.get<UserData>("https://dummyjson.com/users").subscribe(x=>{
      this.userData = x;

    })


  }

  constructor(private http: HttpClient) {

  }
  ngAfterViewInit() {
    this.createCharts();
  }

  createOrderData() {
      Enumerable.range(1,1000).forEach(x=>{
        var o = new Order();
        o.Customer = new Customer();
        o.Customer.FirstName = faker.person.firstName();
        o.Customer.LastName = faker.person.lastName();
        var priceNum = faker.commerce.price({ min: 100, max: 200, dec: 2});
        o.price= "$"+priceNum
        o.quantity = faker.number.int({min:50,max:50000});
        o.orderNum = this.generateGuid();
        o.Total = (o.quantity*parseFloat(priceNum)).toLocaleString('en-US', { style: 'currency', currency: 'USD' });

        this.orderData.push(o);
      })

  }
  generateGuid() : string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0,
        v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }
  createCharts(){

      this.barchart = new Chart("MyBarChart", {
        type: 'bar',
        data: {
          labels: ['2022-05-10', '2022-05-11', '2022-05-12','2022-05-13',
            '2022-05-14', '2022-05-15', '2022-05-16','2022-05-17', ],
          datasets: this.getbarchartData()
        },
        options: {
          aspectRatio:2.5
        }

      });

      this.linechart = new Chart("MyLineChart", {
        type: 'line',
        data: {
          labels: ['2022-05-10', '2022-05-11', '2022-05-12','2022-05-13',
            '2022-05-14', '2022-05-15', '2022-05-16','2022-05-17', ],
          datasets: this.getlinechartData()
        },
        options: {
          aspectRatio:2.5
        }
      });
  }

   getbarchartData() {
    var salesRange = Enumerable.range(70,700).toArray();
     var profitRange = Enumerable.range(0,700).toArray();

    return [
      {
        label: "Sales",
        data: Enumerable.range(8,8)
          .select(x=> faker.helpers.arrayElement(salesRange).toString()).toArray(),
        backgroundColor: '#004BA8'
      },
      {
        label: "Profit",
        data: Enumerable.range(8,8)
          .select(x=> faker.helpers.arrayElement(profitRange).toString()).toArray(),
        backgroundColor: '#4A525A'
      }
    ]
  }

   getlinechartData() {
    return [{
      label: 'Orders Per Day',
      data: [65, 59, 80, 81, 56, 55, 40],
      fill: true,
      backgroundColor:'#24272B',
      borderColor: 'rgb(75, 192, 192)',
      tension: 0.1
    }]
  }

  resetViews(){
    this.homeSelected=false;
    this.productsSelected=false;
    this.usersSelected=false;
    this.ordersSelected=false;
  }

  UsersClicked() {
    this.resetViews();
    this.usersSelected=true;
    
    this.userDtOptions = {
      data: this.userData.users,
      responsive:true,
      columns:[
        {
          title:"Id",
          data: "id"
        },
        {
          title:"First",
          data: "firstName"
        },
        {
          title:"Last",
          data: "lastName"
        },
        {
          title:"DOB",
          data: "birthDate",
          type: "date"
        }

      ]
    }
  }
  ProductsClicked(){
    this.resetViews();
    this.productsSelected=true;
    this.productDtOptions = {
      data: this.productData.products,
      responsive:true,
      columns:[
        {
          title:"Id",
          data: "id"
        },
        {
          title:"Image",
          data:"thumbnail",
          type:"html",
          render: function(x){
            return `<img (mousemove)="handleMouseMove($event)" (mouseleave)="resetImageScale()" class="thumbNail" width="25"  src="${x}" alt="test"   />`;
          }
        },
        {
          title:"Name",
          data:"title"
        },

        {
          title:"Brand",
          data: "brand"
        },
        {
          title:"Description",
          data: "description"
        },
      ]

    }
  }
  OrdersClicked(){
    this.resetViews();
    this.ordersSelected=true;
    this.ordersDtOptions = {
      data: this.orderData,
      responsive:true,
      columns: [
        {
          title: 'First Name',
          data: 'Customer.FirstName'
        },
        {
          title: 'Last Name',
          data: 'Customer.LastName'
        },
        {
          title: 'Order Number',
          data: 'orderNum'
        },
        {
          title: 'Quantity',
          data: 'quantity'
        },
        {
          title: 'Price',
          data: 'price'
        },
        {
          title: 'Total',
          data: 'Total'
        }
      ]
    };
  }
}


