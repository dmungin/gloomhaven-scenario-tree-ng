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
    } else if (scenarios.nodes[scenarioIndex].data.status === 'complete' && (updatedScenario.status === 'incomplete' || updatedScenario.status === 'attempted')) {
      this.hideChildScenarios(scenarios, updatedScenario.id);
    }
    scenarios.nodes[scenarioIndex].data.status = updatedScenario.status;
    scenarios.nodes[scenarioIndex].data.notes = updatedScenario.notes;
    scenarios.nodes[scenarioIndex].data.locked = updatedScenario.locked;
    return scenarios;
  }
  private showChildScenarios(scenarios, parentId) {
    scenarios.edges.filter(edge => (edge.data.source === parentId && (edge.data.type === 'unlocks' || edge.data.type === 'linksto')))
      .forEach(edge => {
        let scenarioIndex = scenarios.nodes.findIndex(scenario => scenario.data.id === edge.data.target);
        if (scenarios.nodes[scenarioIndex].data.status === 'hidden') {
          scenarios.nodes[scenarioIndex].data.status = 'incomplete';
        }
      })
  }
  private hideChildScenarios(scenarios, parentId) {
    scenarios.edges.filter(edge => (edge.data.source === parentId && (edge.data.type === 'unlocks' || edge.data.type === 'linksto')))
      .forEach(edge => {
        let scenarioIndex = scenarios.nodes.findIndex(scenario => scenario.data.id === edge.data.target);
        if (scenarios.nodes[scenarioIndex].data.status === 'incomplete') {
          scenarios.nodes[scenarioIndex].data.status = 'hidden';
          this.hideChildScenarios(scenarios, scenarios.nodes[scenarioIndex].id);
        }

      })
  }
}
