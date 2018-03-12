import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import * as base64 from 'base-64';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
@Injectable()
export class AssetService {

  constructor(private http: Http) { }
  public getScenariosJSON(): Observable<any> {
    let encodedTree = localStorage.getItem('gloomhavenScenarioTree');
    if (!encodedTree) {
      return this.http.get('./assets/scenarios.json')
      .map(response => response.json());
    } else {
      let response = new BehaviorSubject<any>(this.getDecodedScenarios(encodedTree));
      return response;
    }
  }
  public getDecodedScenarios(encodedScenarios) {
    return JSON.parse(base64.decode(encodedScenarios));
  }
  public getEncodedScenarios(scenarios) {
    return base64.encode(JSON.stringify(scenarios))
  }
  public setScenariosJSON(scenarios) {
    localStorage.setItem('gloomhavenScenarioTree', this.getEncodedScenarios(scenarios));
  }
  public getImageUrl(activePage) {
    return `assets/scenarios/${activePage}.jpg`; 
  }

}
