import {Injectable, isDevMode} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({ providedIn: 'root' })
export class Utilities {
  private headers: HttpHeaders;
  constructor(private client: HttpClient) {
    var httpOptions = {
      headers: new HttpHeaders({
        "Content-Type": "application/json",
        "Accept": "*/*",
        //'Authorization': `Bearer ${this.token}`
      })
    };

    this.headers = httpOptions.headers;
  }

  get(url: string): Observable<Object> {
    try {
        console.log(url);
        return  this.client.get(`${url}`,{headers: this.headers});
    } catch (e) {
      console.log(e);
      throw e;
    }

  }

}
