import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators';
import * as cloneDeep from 'lodash.clonedeep';
@Injectable()
export class AssetService {
  private defaultScenariosJSON: any;
  constructor(private http: HttpClient) { }
  public getScenariosJSON(): Observable<any> {
    let encodedTree = localStorage.getItem('gloomhavenScenarioTree');
    return this.http.get<any>('./assets/scenarios.json').pipe(
      map(scenarios => {
        this.defaultScenariosJSON = cloneDeep(scenarios);
        if (encodedTree) {
          scenarios.nodes = this.getDecodedScenarios(JSON.parse(encodedTree)).nodes
        }
        return scenarios;
      })
    );
  }
  public getDecodedScenarios(savedScenarios) {
    savedScenarios.nodes = savedScenarios.nodes.reduce(function(map, node) {
      map[node.id] = node;
      return map;
    }, {});

    let currentNodes = cloneDeep(this.defaultScenariosJSON).nodes.map((node, index) => {
      let savedNode = savedScenarios.nodes[node.data.id];

      /* Logic to allow old saved json format to work */
      if (typeof savedScenarios.version === 'undefined') {
        savedNode.status = savedNode.data.status;
        savedNode.notes = savedNode.data.notes;
        savedNode.x = savedNode.position.x;
        savedNode.y = savedNode.position.y;
        if (parseInt(savedNode.data.id) > 51 && (savedNode.status === 'hidden' || savedNode.data.locked == 'true') ) {
          savedNode.status = 'locked';
        }
      }

      /* If an attribute was saved then copy it over to the current full JSON */
      if (typeof savedNode.status !== 'undefined') {
        node.data.status = savedNode.status;
      }
      if (typeof savedNode.notes !== 'undefined') {
        node.data.notes = savedNode.notes;
      }
      if (typeof savedNode.x !== 'undefined') {
        node.position.x = savedNode.x;
      }
      if (typeof savedNode.y !== 'undefined') {
        node.position.y = savedNode.y;
      }
      return node;
    });
    return {nodes: currentNodes};
  }
  public getEncodedScenarios(scenarios) {
    /* Save only the attributes that are different from the default */
    let simplifiedNodes = scenarios.nodes.map(node => {
      let matchedBase = this.defaultScenariosJSON.nodes.find(base => base.data.id === node.data.id);
      let simpleNode = { id: node.data.id };
      if (matchedBase.data.status !== node.data.status) {
        simpleNode['status'] = node.data.status;
      }
      if (matchedBase.data.notes !== node.data.notes) {
        simpleNode['notes'] = node.data.notes;
      }
      if (matchedBase.position.x !== node.position.x || matchedBase.position.y !== node.position.y) {
        simpleNode['x'] = parseInt(node.position.x);
        simpleNode['y'] = parseInt(node.position.y);
      }
      return simpleNode;
    });
    return {
      nodes: simplifiedNodes,
      version: '2'
    };
  }
  public setScenariosJSON(scenarios) {
    localStorage.setItem('gloomhavenScenarioTree', JSON.stringify(this.getEncodedScenarios(scenarios)));
  }
  public getImageUrl(activePage) {
    return `assets/scenarios/${activePage}.jpg`;
  }
}
