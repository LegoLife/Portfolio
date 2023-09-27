import {Component, OnInit} from '@angular/core';
import {faker, Sex} from '@faker-js/faker';
import {DomSanitizer} from "@angular/platform-browser";
@Component({
  selector: 'app-datagenerator',
  templateUrl: './datagenerator.component.html',
  styleUrls: ['./datagenerator.component.css']
})
export class DatageneratorComponent implements OnInit  {
  workingDataRow:DataRow = new DataRow("","");
  dataList:DataRow[] = [new DataRow("firstName","fName"),new DataRow("lastName","lName"),new DataRow("age","age")];
  options:string[] = [];
  numObjects:number=10;
  error:boolean=false;
  generateFinalData:boolean=false;
  finalData:string="";
  fileUrl:any;
  outputTypes: string[]=["C#","json"];
  selectedOutputType:string= "json";

  constructor(private sanitizer: DomSanitizer) {  }
  ngOnInit(): void {
    var add = ["firstName","lastName","age","zipCode",
      "city","state","country","streetAddress","recentDate","birthdate","futureDate","catBreed","dogBreed","cowBreed","bearBreed","birdBreed"];
    add.forEach(x=> this.options.push(x));
  }

  getSampleData(t:any):any{
    switch(t){
      case "dogBreed":
        return faker.animal.dog()
      case "catBreed":
        return faker.animal.cat()
      case "cowBreed":
        return faker.animal.cow()
      case "bearBreed":
        return faker.animal.bear()
      case "birdBreed":
        return faker.animal.bird()
      case "recentDate":
        return faker.date.recent();
      case "birthdate":
        return faker.date.birthdate();
      case "futureDate":
        return faker.date.future()
      case "zipCode":
        return faker.location.zipCode();
      case "city":
        return faker.location.city();
      case "state":
        return faker.location.state();
      case "country":
        return faker.location.country();
      case "streetAddress":
        return faker.location.streetAddress();
      case "firstName":
          return faker.person.firstName();
      case "lastName":
          return faker.person.lastName();
      case "age":
          return faker.number.int({min:1,max:99});
    }
  }


  addRow(){
    if(this.options.includes(this.workingDataRow.dataType) && this.workingDataRow.title!="changeme"){
      this.error=false;
      this.dataList.push(this.workingDataRow);
      this.workingDataRow = new DataRow("","");

    }
    else{
      this.error=true;
    }
    }


  Remove(item: DataRow) {
    this.finalData = "";
    this.generateFinalData=false;
    var newList:DataRow[] = [];
    this.dataList.forEach(x=> {
      if(x.title!=item.title)
      {
        newList.push(x);
      }
    })
    this.dataList = newList;
  }

  generate() {
    if(this.numObjects <= 99){
      if(this.selectedOutputType=="json")
      {
        this.outputJson();
        return;
      }
        if(this.selectedOutputType=="C#")
        {
          this.outputCSharp();
          return;
        }
    }
  }
  private outputCSharp() {
    var outList = this.getArrayList();
    var props = Object.getOwnPropertyNames(outList[0]);
    var className = "CustomClass"
    var classText=`class ${className} \n{`;

    props.forEach(x=>{
      classText +=`\n\tpublic string ${x} {get;set;}`
    })
    classText += "\n}"
    var listText = `var list = new List<${className}>()\n{`;
     outList.forEach(x=>{
       listText += `\n\tnew ${className}()\n\t\t{`;
       var propList:string[] = [];
       props.forEach(p=>{
          propList.push(`\n\t\t\t${p}=\"${x[p]}\"`);
       })
       listText += propList.join(',');
       listText += "\n\t\t}"
     })
    listText += "\n}"

    this.generateFinalData=true;
    this.finalData = classText+"\n\n"+listText;
  }

  getArrayList():any[]{
    var outList = [];
    for (let o = 0; o < this.numObjects; o++) {
      var myOb:any = {};
      this.dataList.forEach(i=>{
        var title =  i.title;
        var type = i.dataType;
        myOb[title] = this.getSampleData(type);
      })
      outList.push(myOb);
    }
    return outList;
  }

outputJson(){
  var outList = this.getArrayList();

  this.generateFinalData=true;
  this.finalData = JSON.stringify(outList,null,'\t');
}

  download() {
    const blob = new Blob([this.finalData], { type: 'application/octet-stream' });
    this.fileUrl = this.sanitizer.bypassSecurityTrustResourceUrl(window.URL.createObjectURL(blob));
  }
}

class DataRow
{
  constructor(dataType:string,title:string) {
    this.dataType = dataType;
    this.title = title;
  }
  dataType:string;
  title:string;
}
