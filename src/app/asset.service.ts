import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as cloneDeep from 'lodash.clonedeep';
@Injectable()
export class AssetService {
  private defaultScenariosJSON: any;
  constructor(private http: HttpClient) { }
  public getScenariosJSON(): Observable<any> {
    const encodedTree = localStorage.getItem('gloomhavenScenarioTree');
    return this.http.get<any>('./assets/scenarios.json').pipe(
      map(scenarios => {
        // First sort the nodes so that any ui using them keeps order consistent
        scenarios.nodes = scenarios.nodes.sort((n1, n2) => +n1.data.id - +n2.data.id);
        this.defaultScenariosJSON = cloneDeep(scenarios);
        if (encodedTree) {
          scenarios.nodes = this.getDecodedScenarios(scenarios.nodes, encodedTree).nodes;
        }
        return scenarios;
      })
    );
  }
  public getDecodedScenarios(currentNodes, savedScenarioString) {
    const savedScenarios = JSON.parse(savedScenarioString);
    currentNodes.forEach((node, index) => {
      const savedNode = savedScenarios.nodes.find(saved => saved.id === node.data.id) || {};
      const matchedBase = this.defaultScenariosJSON.nodes.find(base => base.data.id === node.data.id);
      /* If an attribute was saved then copy it over to the current full JSON */
      node.data.status = (typeof savedNode.status !== 'undefined') ? savedNode.status: matchedBase.data.status;
      node.data.notes = (typeof savedNode.notes !== 'undefined') ? savedNode.notes: matchedBase.data.notes;
      node.position.x = (typeof savedNode.x !== 'undefined') ? savedNode.x: matchedBase.position.x;
      node.position.y = (typeof savedNode.y !== 'undefined') ? savedNode.y: matchedBase.position.y;

      if (typeof savedNode.treasure !== 'undefined') {
        Object.keys(savedNode.treasure).forEach(number => {
          node.data.treasure[number].looted = savedNode.treasure[number].looted;
        });
      } else {
        Object.keys(matchedBase.data.treasure).forEach(number => {
          node.data.treasure[number].looted = matchedBase.data.treasure[number].looted;
        });
      }
    });
    return {nodes: currentNodes};
  }
  public getEncodedScenarios(scenarios) {
    /* Save only the attributes that are different from the default */
    const changedNodes = scenarios.nodes.reduce((changedNodes, node) => {
      const matchedBase = this.defaultScenariosJSON.nodes.find(base => base.data.id === node.data.id);
      const simpleNode = { id: node.data.id };
      if (matchedBase.data.status !== node.data.status) {
        simpleNode['status'] = node.data.status;
      }
      if (matchedBase.data.notes !== node.data.notes) {
        simpleNode['notes'] = node.data.notes;
      }
      if (matchedBase.position.x !== node.position.x) {
        simpleNode['x'] = parseInt(node.position.x, 10);
      }
      if (matchedBase.position.y !== node.position.y) {
        simpleNode['y'] = parseInt(node.position.y, 10);
      }
      Object.keys(matchedBase.data.treasure).forEach(number => {
        if (matchedBase.data.treasure[number].looted.toString() !== node.data.treasure[number].looted.toString()) {
          if (typeof simpleNode['treasure'] === 'undefined') {
            simpleNode['treasure'] = {};
          }
          simpleNode['treasure'][number] = { looted: node.data.treasure[number].looted.toString() };
        }
      });
      if (Object.keys(simpleNode).length > 1) {
        changedNodes.push(simpleNode);
      }
      return changedNodes;
    }, []);
    return JSON.stringify({nodes: changedNodes, version: '2'});
  }
  public setScenariosJSON(scenarios) {
    localStorage.setItem('gloomhavenScenarioTree', this.getEncodedScenarios(scenarios));
  }
  public getImageUrl(activePage) {
    return `assets/scenarios/${activePage}.jpg`;
  }
}
