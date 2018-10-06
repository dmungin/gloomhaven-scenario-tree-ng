import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators';
@Injectable()
export class AssetService {

  constructor(private http: HttpClient) { }
  public getScenariosJSON(): Observable<any> {
    let encodedTree = localStorage.getItem('gloomhavenScenarioTree');
    return this.http.get<any>('./assets/scenarios.json').pipe(
      map(scenarios => {
        if (encodedTree) {
          scenarios.nodes = this.getDecodedScenarios(scenarios.nodes, encodedTree).nodes
        }
        return scenarios;
      })
    );
  }
  public getDecodedScenarios(defaultNodes, savedScenarioString) {
    let savedScenarios = JSON.parse(savedScenarioString);
    defaultNodes.forEach((node, index) => {
      let savedNode = savedScenarios.nodes[index];
      if (typeof savedScenarios.version === 'undefined') {
        savedNode = savedNode.data;
        if (parseInt(savedNode.id) > 51 && (savedNode.status === 'hidden' || savedNode.locked == 'true') ) {
          savedNode.status = 'locked';
        }
      }
      Object.assign(node.data, savedNode);
    });
    return {nodes: defaultNodes};
  }
  public getEncodedScenarios(scenarios) {
    let simplifiedNodes = scenarios.nodes.map(node => {
      let simpleNode = { status: node.data.status };
      if (node.data.notes !== '') {
        simpleNode['notes'] = node.data.notes;
      }
      return simpleNode;
    });
    return JSON.stringify({nodes: simplifiedNodes, version: '2'});
  }
  public setScenariosJSON(scenarios) {
    localStorage.setItem('gloomhavenScenarioTree', this.getEncodedScenarios(scenarios));
  }
  public getImageUrl(activePage) {
    return `assets/scenarios/${activePage}.jpg`;
  }
}
