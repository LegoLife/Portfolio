import {Component, OnInit} from '@angular/core';
import { faker } from '@faker-js/faker';
import Enumerable from 'linq'




@Component({
  selector: 'app-realestate',
  templateUrl: './realestate.component.html',
  styleUrls: ['./realestate.component.css']
})
export class RealestateComponent implements OnInit {
   homeDataArr:HomeData[] = [];
  filteredHomeDataArr:HomeData[] = [];
  public ranges: any=[0,50000,100000,150000,200000,250000,300000,400000,500000,1000000];
  priceFilterMin:any=this.ranges[0];
  priceFilterMax:any=this.ranges[9];
  searchFilter: string="";
  bathroomFilterMin: number=1;
  bathroomFilterMax: number=5;
  bedroomFilterMin: number=1;
  bedroomFilterMax: number=3;
  trending: boolean = false;
  priceDropped: boolean = false;
  recentlyAdded: boolean=false;
  ngOnInit(): void {
       this.InitData();
      this.filteredHomeDataArr = this.homeDataArr;
  }
  InitData() {

    if(this.filteredHomeDataArr.length > 0){
      this.filteredHomeDataArr=[];
      this.homeDataArr=[];
    }

    for (var i = 0; i < 25; i++) {
      var photoId = faker.number.int( {min: 0, max: 20});
      var homeData = new HomeData();
        homeData.id= i;
        homeData.City= faker.location.city();
        homeData.State= faker.location.state();
        homeData.Zip= faker.location.zipCode();
        homeData.Street= faker.location.streetAddress();
        homeData.Owner= faker.person.firstName() + ' ' + faker.person.lastName();
        homeData.Price= faker.number.int({min:this.priceFilterMin,max:this.priceFilterMax});
        homeData.DatePosted= faker.date.recent({days:90});
        homeData.AboutLong= faker.lorem.paragraph();
        homeData.AboutShort= faker.lorem.sentence();
        homeData.PhotoPath= "images/home" + photoId + ".jpg";
        homeData.BathRooms= faker.number.int( {min: this.bathroomFilterMin, max: this.bathroomFilterMax});
        homeData.BedRooms= faker.number.int( {min: this.bedroomFilterMin, max: this.bedroomFilterMax});
        homeData.SquareFt= faker.number.int( {min: 500, max: 5500}).toString();
        homeData.Age = this.dateDiffInDays(new Date(homeData.DatePosted)).toString();
        homeData.New = faker.helpers.arrayElement([true,false]);
        homeData.PriceDrop = faker.helpers.arrayElement([true,false]);
        homeData.Trending = faker.helpers.arrayElement([true,false]);

        this.homeDataArr.push(homeData);
    }
  }

  Refresh(){
    this.InitData();
    this.filterChanged();
  }

  filterChanged() {
  this.filteredHomeDataArr = [];

    if(this.recentlyAdded==false && this.trending==false && this.priceDropped==false){
      this.filteredHomeDataArr  = Enumerable.from(this.homeDataArr)

        .where(x=>x.Price >= this.priceFilterMin && x.Price <= this.priceFilterMax)
        .where(x=>x.BathRooms >=this.bathroomFilterMin && x.BathRooms <= this.bathroomFilterMax)
        .where(x=> x.BedRooms >= this.bedroomFilterMin && x.BedRooms <= this.bedroomFilterMax)
        .where(x=>x.Street.toLowerCase().includes(this.searchFilter.toLowerCase())
          || x.State.toLowerCase().includes(this.searchFilter.toLowerCase())
          || x.City.toLowerCase().includes(this.searchFilter.toLowerCase()))
        .toArray()
    }else{
      this.filteredHomeDataArr  = Enumerable.from(this.homeDataArr)
        .where(x=>x.PriceDrop==this.priceDropped)
        .where(x=>x.New==this.recentlyAdded)
        .where(x=>x.Trending==this.trending)
        .where(x=>x.Price >= this.priceFilterMin && x.Price <= this.priceFilterMax)
        .where(x=>x.BathRooms >=this.bathroomFilterMin && x.BathRooms <= this.bathroomFilterMax)
        .where(x=> x.BedRooms >= this.bedroomFilterMin && x.BedRooms <= this.bedroomFilterMax)
        .where(x=>x.Street.toLowerCase().includes(this.searchFilter.toLowerCase())
          || x.State.toLowerCase().includes(this.searchFilter.toLowerCase())
          || x.City.toLowerCase().includes(this.searchFilter.toLowerCase()))
        .toArray()
    }
  }
  dateDiffInDays( b:Date) {
    var a = new Date();
    const msPerDay = 1000 * 60 * 60 * 24;

    const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
    const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());

    return Math.floor((utc2 - utc1) / msPerDay)*-1;
  }

  ResetFilters() {
    this.priceFilterMin=100000;
    this.priceFilterMax=1000000;
    this.searchFilter="";
    this.bathroomFilterMin=0;
    this.bathroomFilterMax=5;
    this.trending=false;
    this.priceDropped=false;
    this.recentlyAdded=false;
    this.filterChanged();
  }
}
 class HomeData
{
      public id: number=0;
      public City: string="";
      public State: string="";
      public Zip: string="";
      public Street: string="";
      public Owner: string="";
      public Price: number=0;
      public DatePosted: Date=new Date();
      public AboutLong: string="";
      public AboutShort: string="";
      public PhotoPath: string="";
      public BathRooms: number=0;
      public SquareFt: string="";
      public Age: string ="";
      public BedRooms: number=0;
      public Trending:boolean=false;
      public New:boolean=false;
      public PriceDrop:boolean=false;
}
