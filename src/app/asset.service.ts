import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
@Injectable()
export class AssetService {

  constructor(private http: Http) { }
  public getScenariosJSON(): Observable<any> {
    let encodedTree = localStorage.getItem('gloomhavenScenarioTree');
    return this.http.get('./assets/scenarios.json').map(response => {
      let scenarios = response.json();
      if (encodedTree) {
        scenarios.nodes = this.getDecodedScenarios(encodedTree).nodes;
      }
      return scenarios;
    });
  }
  public getDecodedScenarios(encodedScenarios) {
    return JSON.parse(encodedScenarios);
  }
  public getEncodedScenarios(scenarios) {
    return JSON.stringify({nodes: scenarios.nodes});
  }
  public setScenariosJSON(scenarios) {
    localStorage.setItem('gloomhavenScenarioTree', this.getEncodedScenarios(scenarios));
  }
  public getImageUrl(activePage) {
    return `assets/scenarios/${activePage}.jpg`; 
  }

}
