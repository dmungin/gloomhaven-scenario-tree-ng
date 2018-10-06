import { Injectable } from '@angular/core';
import * as cloneDeep from 'lodash.clonedeep';
@Injectable()
export class TreeLogicService {

  constructor() { }

  public updateScenario(originalScenarios, updatedScenario) : any {
    let scenarios = cloneDeep(originalScenarios);
    let scenarioIndex = scenarios.nodes.findIndex(scenario => scenario.data.id === updatedScenario.id);
    if (updatedScenario.status === 'complete') {
      this.showChildScenarios(scenarios, updatedScenario.id);
    } else if (scenarios.nodes[scenarioIndex].data.status === 'complete'
      && (updatedScenario.status === 'incomplete' || updatedScenario.status === 'attempted' || updatedScenario.status === 'hidden')) {
      this.hideChildScenarios(scenarios, updatedScenario.id);
    }
    scenarios.nodes[scenarioIndex].data.status = updatedScenario.status;
    scenarios.nodes[scenarioIndex].data.notes = updatedScenario.notes;
    return scenarios;
  }
  private showChildScenarios(scenarios, parentId) {
    scenarios.edges.filter(edge => (edge.data.source === parentId && (edge.data.type === 'unlocks' || edge.data.type === 'linksto')))
      .forEach(edge => {
        let scenarioIndex = scenarios.nodes.findIndex(scenario => scenario.data.id === edge.data.target);
        if (scenarios.nodes[scenarioIndex].data.status === 'hidden' || scenarios.nodes[scenarioIndex].data.status === 'locked') {
          scenarios.nodes[scenarioIndex].data.status = 'incomplete';
        }
      })
  }
  private hideChildScenarios(scenarios, parentId) {
    scenarios.edges
      .filter(edge => (edge.data.source === parentId && (edge.data.type === 'unlocks' || edge.data.type === 'linksto')))
      .forEach(childEdge => {
        let childScenarioIndex = scenarios.nodes.findIndex(scenario => scenario.data.id === childEdge.data.target);
        let incomingEdges = scenarios.edges.filter(edge => (edge.data.target === childEdge.data.target && edge.data.source !== parentId));
        let keepActive;
        incomingEdges.forEach(incomingEdge => {
          keepActive = scenarios.nodes.find(scenario => (scenario.data.id === incomingEdge.data.source && scenario.data.status === 'complete'))
        });
        if (typeof keepActive === 'undefined') {
          if (scenarios.nodes[childScenarioIndex].data.status === 'incomplete') {
            if (parseInt(scenarios.nodes[childScenarioIndex].data.id) <= 51) {
              scenarios.nodes[childScenarioIndex].data.status = 'hidden';
            } else {
              scenarios.nodes[childScenarioIndex].data.status = 'locked';
            }
            this.hideChildScenarios(scenarios, scenarios.nodes[childScenarioIndex].id);
          }
        }
      })
  }
}
