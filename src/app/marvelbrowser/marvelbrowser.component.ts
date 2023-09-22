import {Component, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import Enumerable from "linq";
import {filter} from "rxjs";
import {faker} from "@faker-js/faker";

@Component({
  selector: 'app-marvelbrowser',
  templateUrl: './marvelbrowser.component.html',
  styleUrls: ['./marvelbrowser.component.css']
})
export class MarvelbrowserComponent implements  OnInit{
    characterData:Character[]=[];
    filterData:Character[]=[];
    url: string = '/assets/characters.json';
  searchFilter: string="";
  constructor(private http: HttpClient) {

  }
  ngOnInit(): void {
    this.fetch()

  }

  filterChanged() {
    var filterLower = this.searchFilter.toLowerCase();
    this.filterData = Enumerable.from(this.characterData)
      .where(x=>x.name.toLowerCase().includes(filterLower)
      ||x.description.toLowerCase().includes(filterLower))

      .toArray();
  }
  pickRandom() {
    this.filterData = [];
    this.filterData.push(faker.helpers.arrayElement(this.characterData));
  }

  private fetch() {
    this.http.get<Character[]>(this.url).subscribe((res) => {
      this.characterData = Enumerable.from(res).where(x=>x.description.length>0)
        .orderBy(x=>x.name)
        .toArray();
      this.filterData = this.characterData;

    });
  }

  clearFilters() {
    this.fetch();
  }
}


export interface Character {
  id: number
  name: string
  description: string
  modified: string
  thumbnail: Thumbnail
  resourceURI: string
  comics: Comics
  series: Series
  stories: Stories
  events: Events
  urls: Url[]
}

export interface Thumbnail {
  path: string
  extension: string
}

export interface Comics {
  available: number
  collectionURI: string
  items: Item[]
  returned: number
}

export interface Item {
  resourceURI: string
  name: string
}

export interface Series {
  available: number
  collectionURI: string
  items: Item2[]
  returned: number
}

export interface Item2 {
  resourceURI: string
  name: string
}

export interface Stories {
  available: number
  collectionURI: string
  items: Item3[]
  returned: number
}

export interface Item3 {
  resourceURI: string
  name: string
  type: string
}

export interface Events {
  available: number
  collectionURI: string
  items: Item4[]
  returned: number
}

export interface Item4 {
  resourceURI: string
  name: string
}

export interface Url {
  type: string
  url: string
}



