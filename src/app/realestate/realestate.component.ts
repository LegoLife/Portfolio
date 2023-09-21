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
  priceFilterMin:number=100000;
  priceFilterMax:number=1000000;
  searchFilter: string="";
  bathroomFilterMin: number=1;
  bathroomFilterMax: number=5;
  bedroomFilterMin: number=1;
  bedroomFilterMax: number=3;
  ngOnInit(): void {
       this.InitData();
      this.filteredHomeDataArr = this.homeDataArr;
  }
  InitData() {
    if(this.homeDataArr.length>0){
      this.homeDataArr=[];
      this.filteredHomeDataArr=[];
      this.filteredHomeDataArr = this.homeDataArr;
    }

    for (var i = 0; i < 25; i++) {

      var photoId = faker.number.int( {min: 0, max: 20});

      var d = new HomeData();

        d.id= i;
        d.City= faker.location.city();
        d.State= faker.location.state();
        d.Zip= faker.location.zipCode();
        d.Street= faker.location.streetAddress();
        d.Owner= faker.person.firstName() + ' ' + faker.person.lastName();
        d.Price= faker.number.int({min:this.priceFilterMin,max:this.priceFilterMax});
        d.DatePosted= faker.date.recent({days:90});
        d.AboutLong= faker.lorem.paragraph();
        d.AboutShort= faker.lorem.sentence();
        d.PhotoPath= "images/home" + photoId + ".jpg";
        d.BathRooms= faker.number.int( {min: this.bathroomFilterMin, max: this.bathroomFilterMax});
        d.BedRooms= faker.number.int( {min: this.bedroomFilterMin, max: this.bedroomFilterMax});
        d.SquareFt= faker.number.int( {min: 500, max: 5500}).toString();
        d.Age = this.dateDiffInDays(new Date(d.DatePosted)).toString();

      this.homeDataArr.push(d);
    }

  }

  Refresh(){
    this.InitData();
    this.filterChanged();
  }

  filterChanged() {



      this.filteredHomeDataArr = Enumerable.from(this.homeDataArr)
        .where(x=>x.Price >= this.priceFilterMin && x.Price <= this.priceFilterMax)
        .where(x=>x.BathRooms >=this.bathroomFilterMin && x.BathRooms <= this.bathroomFilterMax)
        .where(x=> x.BedRooms >= this.bedroomFilterMin && x.BedRooms <= this.bedroomFilterMax)
        .where(x=>x.Street.toLowerCase().includes(this.searchFilter.toLowerCase())
        || x.State.toLowerCase().includes(this.searchFilter.toLowerCase())
        || x.City.toLowerCase().includes(this.searchFilter.toLowerCase()))
        .toArray()

  }

  dateDiffInDays( b:Date) {
    var a = new Date();
    const _MS_PER_DAY = 1000 * 60 * 60 * 24;
    // Discard the time and time-zone information.
    const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
    const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());

    return Math.floor((utc2 - utc1) / _MS_PER_DAY)*-1;
  }

  ResetFilters() {
    this.priceFilterMin=100000;
    this.priceFilterMax=1000000;
    this.searchFilter="";
    this.bathroomFilterMin=0;
    this.bathroomFilterMax=5;
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

}


