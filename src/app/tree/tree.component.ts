import { Component, OnChanges, Input, Output, EventEmitter, ViewChild, SimpleChanges } from '@angular/core';
import cytoscape from 'cytoscape';
import cxtmenu from 'cytoscape-cxtmenu';
cytoscape.use(cxtmenu);
@Component({
  selector: 'app-tree',
  template: '<div id="cy" #cy class="flex-item"></div>',
  styleUrls: ['./tree.component.css']
})
export class TreeComponent implements OnChanges {
  @Input()  elements: any;
  @Input()  selectedScenario: any;
  @Output() selectScenario = new EventEmitter();
  @Output() updateScenario = new EventEmitter<any>();

  @ViewChild('cy', { static: true }) cyEl;
  private initialLoad = true;
  private cy: any;

  public constructor() {}
  public ngOnChanges(change: SimpleChanges): any {
    this.render();
    if (change.selectedScenario
      && change.selectedScenario.currentValue !== null
      && change.selectedScenario.currentValue.status !== 'hidden') {
      this.panToSelected();
    }
    this.updateStyles();
  }
  public render() {
    let pan: {x: number, y: number};
    let selectedNode = null;
    if (!this.initialLoad) {
      // Save current viewport pan location and selected node to re-set it after render
      pan = this.cy.pan();
      selectedNode = this.cy.nodes(':selected');
      this.cy.elements().remove();
      this.cy.add(this.elements);
    } else {
      this.cy = cytoscape(this.getCytoscapeConfig());
      this.cy.cxtmenu(this.getCxtMenuConfig());
      pan = {x: (this.cy.width() / 2), y: 50};
      this.cy.on('tap', 'node', this.nodeClicked.bind(this));
    }
    this.cy.pan(pan);
    // Reselect previously selected node after each render
    if (selectedNode != null) {
      this.cy.$(selectedNode).select();
    }
    this.initialLoad = false;
  }
  private updateStyles() {
    this.setNodeVisibility();
    this.setEdgeVisibility();
    this.colorScenarios();
    this.checkSpecialCases();
    // selected nodes are pink
    this.cy.nodes(':selected').css({
      'color': '#ff4081',
      'background-color': '#ff4081',
      'border-width': '0px'
    });
  }
  private setNodeVisibility() {
    this.cy.nodes('[status != "hidden"]')
      .css({'visibility': 'visible'})
      .selectify();
    this.cy.nodes('[status = "hidden"]')
      .css({
        'visibility': 'hidden',
        'text-opacity': '0'
      });
  }
  private setEdgeVisibility() {
    // Set edges from non-complete nodes to hidden
    this.cy.nodes('[status = "incomplete"], [status = "attempted"], [status = "hidden"], [status = "locked"]')
      .outgoers('edge')
      .css({'visibility': 'hidden'});
    // Set unlock edges from complete nodes to visible
    this.cy.nodes('[status = "complete"]')
      .outgoers('edge[type = "unlocks"]')
      .css({'visibility': 'visible'});
    // Set requiredby edges from visible nodes to visible
    this.cy.nodes('[status != "hidden"][id != 21]')
      .outgoers('edge[type = "requiredby"][target != "26"]')
      .css({'visibility': 'visible'});
    // Set requiredby edges from complete nodes to hidden (requirement met)
    this.cy.nodes('[status = "complete"]')
      .outgoers('edge[type = "requiredby"]')
      .css({'visibility': 'hidden'});
    // Set blocks edges from complete nodes to visible
    this.cy.nodes('[status = "complete"]')
      .outgoers('edge[type = "blocks"][target != "27"][target != "31"][target != "33"]')
      .css({'visibility': 'visible'});
    // Set blocks edges to complete nodes to hidden (completed nodes cannot be blocked)
    this.cy.nodes('[status = "complete"]')
      .incomers('edge[type = "blocks"]')
      .css({'visibility': 'hidden'});
    // Set edges coming into hidden nodes to be hidden (cleans up edges to nothing)
    this.cy.nodes('[status = "hidden"]')
      .incomers('edge')
      .css({'visibility': 'hidden'});
  }
  private colorScenarios() {
    // Incomplete nodes are black
    this.cy.nodes('[status = "incomplete"], [status = "locked"]').css({
      'color': '#000',
      'background-color': '#000',
      'border-width': '0px'});
    // complete nodes are purple
    this.cy.nodes('[status = "complete"]').css({
      'color': '#3f51b5',
      'background-color': '#3f51b5',
      'border-width': '0px'});
    // attempted nodes are an unfilled circle
    this.cy.nodes('[status = "attempted"]').css({
      'color': '#000',
      'background-color': '#fff',
      'border-width': '1px'});

    // Scenarios blocked by other scenarios being incomplete are grey
    this.cy.nodes('[status != "complete"][id != 21]')
      .outgoers('edge[type = "requiredby"][target != "26"]')
      .targets('node[status != "complete"]')
      .css({
        'background-color': '#c9c9c9',
        'border-width': '0px'
      });
    // Scenarios blocked by other scenarios being complete are red
    this.cy.nodes('[status = "complete"]')
      .outgoers('edge[type = "blocks"][target != "27"][target != "31"][target != "33"]')
      .targets('node[status != "complete"]')
      .css({
        'background-color': '#f44336',
        'border-width': '0px'
      });
  }
  private checkSpecialCases() {
    const scenario21Complete = this.cy.nodes('#21').data('status') === 'complete';
    const scenario24Complete = this.cy.$('#24').data('status') === 'complete';
    const scenario42Complete = this.cy.$('#42').data('status') === 'complete';
    const scenario25Complete = this.cy.$('#25').data('status') === 'complete';
    const scenario35Complete = this.cy.$('#35').data('status') === 'complete';
    const scenario23Complete = this.cy.$('#23').data('status') === 'complete';
    const scenario33Complete = this.cy.$('#33').data('status') === 'complete';
    const scenario43Complete = this.cy.$('#43').data('status') === 'complete';
    const scenario98Complete = this.cy.$("#98").data("status") === "complete";
    const scenario99Complete = this.cy.$("#99").data("status") === "complete";
    const scenario100Complete = this.cy.$("#100").data("status") === "complete";
    const scenario101Complete = this.cy.$("#101").data("status") === "complete";
    const scenario110Complete = this.cy.$("#110").data("status") === "complete";
    const scenario111Complete = this.cy.$("#111").data("status") === "complete";
    const scenario112Complete = this.cy.$("#112").data("status") === "complete";
    const scenario113Complete = this.cy.$("#113").data("status") === "complete";
    const knowledgeIsPowerCount =
      Number(scenario98Complete) +
      Number(scenario99Complete) +
      Number(scenario100Complete) +
      Number(scenario101Complete);
    const perilAvertedCount =
      Number(scenario110Complete) +
      Number(scenario111Complete) +
      Number(scenario112Complete) +
      Number(scenario113Complete);
    if (!scenario21Complete) {
      if (this.cy.nodes('#35').data('status') === 'complete') {
        if (this.cy.nodes('#27').data('status') === 'attempted' ||
          this.cy.nodes('#27').data('status') === 'incomplete') {
            this.cy.nodes('#35').outgoers('[type = "blocks"][target = "27"]').css({
              'visibility': 'visible'
            }).targets().css({
              'background-color': '#f44336',
              'border-width': '0px'
            });
        }
        if (this.cy.nodes('#31').data('status') === 'attempted' ||
          this.cy.nodes('#31').data('status') === 'incomplete') {
            this.cy.nodes('#35').outgoers('[type = "blocks"][target = "31"]').css({
              'visibility': 'visible'
            }).targets().css({
              'background-color': '#f44336',
              'border-width': '0px'
            });
        }
      }
    }
    if (!scenario24Complete || scenario42Complete) {
      if (this.cy.nodes('#34').data('status') === 'complete') {
        if (this.cy.nodes('#33').data('status') === 'attempted' ||
          this.cy.nodes('#33').data('status') === 'incomplete') {
            this.cy.nodes('#34').outgoers('[type = "blocks"][target = "33"]').css({
              'visibility': 'visible'
            }).targets().css({
              'background-color': '#f44336',
              'border-width': '0px'
            });
        }
      }
    }
    if (!scenario25Complete) {
      if (this.cy.nodes('#42').data('status') === 'complete') {
        if (this.cy.nodes('#33').data('status') === 'attempted' ||
          this.cy.nodes('#33').data('status') === 'incomplete') {
            this.cy.nodes('#42').outgoers('[type = "blocks"][target = "33"]').css({
              'visibility': 'visible'
            }).targets().css({
              'background-color': '#f44336',
              'border-width': '0px'
            });
        }
      }
    }
    if (scenario35Complete) {
      if (this.cy.nodes('#21').data('status') !== 'complete') {
        if (this.cy.nodes('#31').data('status') === 'attempted' ||
          this.cy.nodes('#31').data('status') === 'incomplete') {
            this.cy.nodes('#21').outgoers('[type = "requiredby"][target = "31"]').css({
              'visibility': 'visible'
            }).targets().css({
              'background-color': '#c9c9c9',
              'border-width': '0px'
            });
        }
      }
    }
    if (!scenario23Complete && !scenario43Complete) {
      if (this.cy.nodes('#26').data('status') === 'attempted' ||
        this.cy.nodes('#26').data('status') === 'incomplete') {
          this.cy.nodes('#23, #43').outgoers('[type = "requiredby"][target = "26"]').css({
            'visibility': 'visible',
            'curve-style': 'unbundled-bezier',
            'control-point-distances': '50 50 50'
          }).targets().css({
            'background-color': '#c9c9c9',
            'border-width': '0px'
          });
      }
    }
    if (scenario33Complete && scenario25Complete) {
      this.cy.nodes('#33').outgoers('[type = "blocks"][target = "34"]').css({
        'visibility': 'visible'
      }).targets().css({
        'background-color': '#f44336',
        'border-width': '0px'
      });
    }
    if (knowledgeIsPowerCount > 1) {
      this.cy
        .nodes("#98, #99, #100, #101")
        .outgoers('[type = "requiredby"]')
        .css({
          visibility: "hidden",
        })
        .targets()
        .css({
          "background-color": "#000000",
          "border-width": "0px",
        });
    }
    if (perilAvertedCount > 1) {
      this.cy
        .nodes("#110, #111, #112, #113")
        .outgoers('[type = "requiredby"]')
        .css({
          visibility: "hidden",
        })
        .targets()
        .css({
          "background-color": "#000000",
          "border-width": "0px",
        });
    }
  }
  private nodeClicked(e) {
    const scenario = e.target;
    if (scenario.selectable()) {
      this.selectScenario.emit(scenario);
      window.setTimeout(() => this.updateStyles(), 50);
    }
  }
  private panToSelected() {
    const selectedNode = this.cy.nodes(`#${this.selectedScenario.id}`);
    this.cy.nodes().unselect();
    selectedNode.select();
    // this.colorScenarios();
    this.cy.animate({
      center: {
        eles: selectedNode
      }
    });
  }
  private getCytoscapeConfig() {
    return {
      container: this.cyEl.nativeElement,
      elements: this.elements,
      zoomingEnabled: false,
      zoom: 0.5,
      userZoomingEnabled: true,
      boxSelectionEnabled: false,
      autounselectify: false,
      autolock: false,
      layout: {
        name: 'preset'
      },
      style: cytoscape.stylesheet()
        .selector('node')
        .css({
            'content': 'data(name)',
            'font-size': '18px',
            'font-weight': '600',
            'text-valign': 'top',
            'text-halign': 'center',
            'color': '#000',
            'text-outline-width': '0',
            'background-color': '#000',
            'text-outline-color': '#000',
            'opacity': '1',
            'border-color': '#3f51b5',
            'border-style': 'solid'
        })
        .selector('node[status = "locked"]')
        .css({
          'content': ( ele ) => '#' + ele.data('id')
        })
        .selector('edge')
        .css({
            'curve-style': 'bezier',
            'target-arrow-shape': 'triangle',
            'target-arrow-color': '#000',
            'line-color': '#000',
            'width': 2,
            'opacity': '.87'
        })
        .selector('edge[type = "linksto"]')
        .css({
          'line-style': 'dashed'
        })
        .selector('edge[type = "requiredby"]')
        .css({
          'visibility': 'hidden',
          'line-color': '#69f0ae',
          'target-arrow-color': '#69f0ae'
        })
        .selector('edge[type = "blocks"]')
        .css({
          'visibility': 'hidden',
          'line-color': '#f44336',
          'target-arrow-color': '#f44336'
        })
    };
  }
  private getCxtMenuConfig() {
    return {
      commands: (element) => {
        const data = element.data();
        return [{
        content: 'Incomplete',
        fillColor: data.status === 'incomplete' ? 'rgba(255, 64, 129, 0.75)' : 'rgba(0, 0, 0, 0.75)',
        select: (ele) => this.cxtMenuStatusChange('incomplete', ele)
      }, {
        content: 'Attempted',
        fillColor: data.status === 'attempted' ? 'rgba(255, 64, 129, 0.75)' : 'rgba(0, 0, 0, 0.75)',
        select: (ele) => this.cxtMenuStatusChange('attempted', ele)
      }, {
        content: 'Complete',
        fillColor: data.status === 'complete' ? 'rgba(255, 64, 129, 0.75)' : 'rgba(0, 0, 0, 0.75)',
        select: (ele) => this.cxtMenuStatusChange('complete', ele)
      }];
    },
      activeFillColor: 'rgba(63, 81, 181, 1)'
    };
  }
  private cxtMenuStatusChange(status, ele) {
    const data = ele.data();
    const scenario = {
      id: data.id,
      status: status,
      notes: data.notes,
      treasure: data.treasure
    };
    this.updateScenario.emit(scenario);
  }

}
