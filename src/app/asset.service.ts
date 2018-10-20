import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { map } from 'rxjs/operators';
import * as cloneDeep from 'lodash.clonedeep';


export const NodeStatusHidden = 'hidden';
export const NodeStatusIncomplete = 'incomplete';
export const NodeStatusAttempted = 'attempted';
export const NodeStatusComplete = 'complete';

export type ScenarioNodeStatuses = typeof NodeStatusHidden | typeof NodeStatusIncomplete | typeof NodeStatusAttempted | typeof NodeStatusComplete;

export interface ScenarioTreasure {
  id: string;
  looted: boolean;
  description: string;
}

export interface ScenarioNodeData {
  id: string;
  name: string;
  status: ScenarioNodeStatuses;
  side?: boolean;
  notes: string;
  pages: number[];
  activePage?: number;
  imageUrl?: string;
  treasure: string[];
}

export interface ScenarioNodePosition {
  x: number;
  y: number;
}

export interface ScenarioNode {
  data: ScenarioNodeData;
  position: ScenarioNodePosition;
}

export interface ScenarioEdgeData {
  source: string;
  target: string;
  type: 'requiredby' | 'blocks' | 'linksto' | 'unlocks';
}

export interface ScenarioEdge {
  data: ScenarioEdgeData;
}

export interface ScenarioData {
  nodes: ScenarioNode[];
  edges: ScenarioEdge[];
  treasures: ScenarioTreasure[];
}

export interface EncodedNodeV1 {
  data: {
    id: string;
    status: ScenarioNodeStatuses;
    notes: string;
    locked?: 'true'
  };
  position: {
    x: string;
    y: string;
  };
}

export interface EncodedNodeV1Data {
  nodes: EncodedNodeV1[];
  version: undefined;
}

export interface EncodedNodeV2 {
  id: string;
  notes?: string;
  status?: ScenarioNodeStatuses;
  x?: number;
  y?: number;
  treasure?: {
    [id: string]: {
      looted: "true"
    };
  };
}

export interface EncodedNodeV2Data {
  nodes: EncodedNodeV2[];
  version: '2';
}

export interface EncodedNodeV3 {
  notes?: string;
  status?: ScenarioNodeStatuses;
  x?: number;
  y?: number;
}

export interface EncodedNodeV3Map {
  [id: string]: EncodedNodeV3;
};

export interface EncodedNodeV3Data {
  scenarios: EncodedNodeV3Map;
  treasures: string[];
  version: '3';
}


@Injectable()
export class AssetService {
  private defaultScenariosJSON: ScenarioData;

  constructor(private http: HttpClient) {}
  
  public getScenariosJSON(): Observable<ScenarioData> {
    let encodedTree = localStorage.getItem('gloomhavenScenarioTree');
    return this.http.get<any>('./assets/scenarios.json').pipe(
      map(scenarios => {
        this.defaultScenariosJSON = cloneDeep(scenarios);
        if (encodedTree) {
          scenarios = this.getDecodedScenarios(JSON.parse(encodedTree));
        }
        return scenarios;
      })
    );
  }

  public getDecodedScenarios(encodedNodes: EncodedNodeV3Data | EncodedNodeV2Data | EncodedNodeV1Data): ScenarioData {
    const defaultData: ScenarioData = cloneDeep(this.defaultScenariosJSON);

    if (encodedNodes.version === undefined) {
      const encodedNodeMap: {[key: string]: EncodedNodeV1} = (encodedNodes as EncodedNodeV1Data).nodes.reduce((map, node) => {
        map[node.data.id] = node;
        return map;
      }, {});

      defaultData.nodes.forEach((node) => {
        const encodedNode = encodedNodeMap[node.data.id];
        if (!encodedNode) return;

        /* If an attribute was saved then copy it over to the current full JSON */
        if (typeof encodedNode.data.status !== 'undefined') {
          if (parseInt(encodedNode.data.id) > 51 && (encodedNode.data.status === NodeStatusHidden || encodedNode.data.locked == 'true')) {
            node.data.status = NodeStatusHidden;
          } else {
            node.data.status = encodedNode.data.status;
          }
        }
        if (typeof encodedNode.data.notes !== 'undefined') {
          node.data.notes = encodedNode.data.notes;
        }
        if (typeof encodedNode.position.x !== 'undefined') {
          node.position.x = parseInt(encodedNode.position.x);
        }
        if (typeof encodedNode.position.y !== 'undefined') {
          node.position.y = parseInt(encodedNode.position.x);
        }
      });
    } else if (encodedNodes.version === '2') {
      const encodedNodesV2 = encodedNodes as EncodedNodeV2Data;

      const encodedNodeMap: {[key: string]: EncodedNodeV2;} = encodedNodesV2.nodes.reduce((map, node) => {
        map[node.id] = node;
        return map;
      }, {});

      defaultData.nodes.forEach((node) => {
        const encodedNode = encodedNodeMap[node.data.id];
        if (!encodedNode) return;

        /* If an attribute was saved then copy it over to the current full JSON */
        if (typeof encodedNode.status !== 'undefined') {
          node.data.status = encodedNode.status;
        }
        if (typeof encodedNode.notes !== 'undefined') {
          node.data.notes = encodedNode.notes;
        }
        if (typeof encodedNode.x !== 'undefined') {
          node.position.x = encodedNode.x;
        }
        if (typeof encodedNode.y !== 'undefined') {
          node.position.y = encodedNode.y;
        }
      });

      const treasureMap: string[] = encodedNodesV2.nodes.reduce((map, node) => {
        if (node.treasure) {
          Object.keys(node.treasure).reduce((map, treasureId) => {
            if (node.treasure[treasureId].looted === 'true') {
              map.push(treasureId);
            }
            return map;
          }, map);
        }
        return map;
      }, []);

      defaultData.treasures.forEach((node) => {
        node.looted = treasureMap.includes(node.id);
      });
    } else if (encodedNodes.version === '3') {
      const encodedNodesV3 = encodedNodes as EncodedNodeV3Data;

      defaultData.nodes.forEach((node) => {
        const encodedNode = encodedNodesV3.scenarios[node.data.id];
        if (!encodedNode) return;

        /* If an attribute was saved then copy it over to the current full JSON */
        if (typeof encodedNode.status !== 'undefined') {
          node.data.status = encodedNode.status;
        }
        if (typeof encodedNode.notes !== 'undefined') {
          node.data.notes = encodedNode.notes;
        }
        if (typeof encodedNode.x !== 'undefined') {
          node.position.x = encodedNode.x;
        }
        if (typeof encodedNode.y !== 'undefined') {
          node.position.y = encodedNode.y;
        }
      });

      defaultData.treasures.forEach((node) => {
        node.looted = encodedNodesV3.treasures.includes(node.id);
      });
    } else {
      throw new Error('Unknown version ${encodedNodes.version}');
    }

    return defaultData;
  }

  public getEncodedScenarios(scenarios: ScenarioData): EncodedNodeV3Data {
    const defaultNodeMap: {[id: string]: ScenarioNode;} = this.defaultScenariosJSON.nodes.reduce((map, node) => {
      map[node.data.id] = node;
      return map;
    }, {});

    /* Save only the attributes that are different from the default */
    const encodedNodes: EncodedNodeV3Map = scenarios.nodes.reduce((obj, node) => {
      const defaultNode = defaultNodeMap[node.data.id];
      const encodedNode: EncodedNodeV3 = {};
      if (defaultNode.data.status !== node.data.status) {
        encodedNode.status = node.data.status;
      }
      if (defaultNode.data.notes !== node.data.notes) {
        encodedNode.notes = node.data.notes;
      }
      if (defaultNode.position.x !== node.position.x || defaultNode.position.y !== node.position.y) {
        encodedNode.x = node.position.x;
        encodedNode.y = node.position.y;
      }

      if (Object.keys(encodedNode).length) {
        obj[node.data.id] = encodedNode;
      }
      return obj;
    }, {});

    const treasureNodes = scenarios.treasures.filter(node => node.looted).map(node => node.id);
    treasureNodes.sort();

    return {
      scenarios: encodedNodes,
      treasures: treasureNodes,
      version: '3',
    };
  }

  public setScenariosJSON(scenarios: ScenarioData) {
    localStorage.setItem('gloomhavenScenarioTree', JSON.stringify(this.getEncodedScenarios(scenarios)));
  }

  public getImageUrl(activePage: number): string {
    return `assets/scenarios/${activePage}.jpg`;
  }
}
