import {Component, OnInit} from '@angular/core';
import {Chart} from "chart.js";
import Enumerable from "linq";
import {faker} from "@faker-js/faker";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit{
  public barchart: any;
  public linechart:any;
  public orderData:Order[]=[];

  ngOnInit(): void {
    this.createCharts();
    this.createOrderData();



  }

  createOrderData() {
      Enumerable.range(1,1000).forEach(x=>{
        var o = new Order();
        o.Customer = new Customer();
        o.Customer.FirstName = faker.person.firstName();
        o.Customer.LastName = faker.person.lastName();
        o.price=faker.commerce.price();
        o.quantity = faker.number.int({min:50,max:50000});
        o.orderNum = this.generateGuid();

        o.Total = o.quantity*parseInt(o.price);

        this.orderData.push(o);

      })


  }
  generateGuid() : string {
    //'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'
    return 'xxxxxxxx-xxxx-4xxx-yxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0,
        v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }
  createCharts(){
    this.barchart = new Chart("MyBarChart", {
      type: 'bar', //this denotes tha type of chart

      data: {// values on X-Axis
        labels: ['2022-05-10', '2022-05-11', '2022-05-12','2022-05-13',
          '2022-05-14', '2022-05-15', '2022-05-16','2022-05-17', ],
        datasets: this.getbarchartData()
      },
      options: {
        aspectRatio:2.5
      }

    });

    this.linechart = new Chart("MyLineChart", {
      type: 'line', //this denotes tha type of chart

      data: {// values on X-Axis
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
        // data: ['467','576', '572', '79', '92',
        //   '574', '573', '576'],
        data: Enumerable.range(8,8)
          .select(x=> faker.helpers.arrayElement(salesRange).toString()).toArray(),
        backgroundColor: '#004BA8'
      },
      {
        label: "Profit",
        data: Enumerable.range(8,8)
          .select(x=> faker.helpers.arrayElement(profitRange).toString()).toArray(),

        backgroundColor: '#4A525A'
        /*#3E78B2*/
        /*#004BA8*/
        /*#4A525A*/
        /*#24272B*/
        /*#07070A*/
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


}

 class Order
{
  public Customer:Customer = new Customer;
  public orderNum:string="";
  public quantity:number=0;
  public price:string="";
  Total: number=0;
}

class Customer
{
  public FirstName:string="";
  public LastName:string="";
}

