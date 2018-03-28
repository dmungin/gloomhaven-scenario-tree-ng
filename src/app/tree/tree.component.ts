import { Component, OnChanges, ElementRef, Input, Output, EventEmitter, ViewChild, AfterViewInit } from '@angular/core';
import * as cytoscape from 'cytoscape';
@Component({
  selector: 'app-tree',
  template: '<div id="cy" #cy class="flex-item"></div>',
  styleUrls: ['./tree.component.css']
})
export class TreeComponent implements OnChanges {
  @Input() public elements: any;
  @Output() public selectScenario = new EventEmitter();
  @ViewChild('cy') cyEl;
  public hideLocked: boolean = true;
  private initialLoad: boolean = true;
  private cy: any;

  public constructor() {}
  public ngOnChanges(): any {
      this.render();
  }
  public render() {
    let pan;
    let selectedNode = null;
    if (!this.initialLoad) {
      // Save current viewport pan location and selected node to re-set it after render
      pan = this.cy.pan();
      selectedNode = this.cy.nodes(':selected');
    }
    this.cy = cytoscape({
        container: this.cyEl.nativeElement,
        elements: this.elements,
        zoomingEnabled: false,
        zoom: 0.5,
        userZoomingEnabled: true,
        boxSelectionEnabled: false,
        autounselectify: false,
        autolock: false,
        layout: {
          name: "preset"
        },
        style: cytoscape.stylesheet()
          .selector('node')
          .css({
              'content': 'data(name)',
              'font-size': '1.3em',
              'font-weight': '600',
              'text-valign': 'top',
              'text-halign': 'center',
              'color': '#000',
              'text-outline-width': '0',
              'background-color': '#000',
              'text-outline-color': '#000',
              'opacity': '.87',
              'border-color': '#3f51b5',
              'border-style': 'solid'
          })
          .selector('node[locked = "true"]')
          .css({
            'content': ( ele ) => '#' + ele.data('id')
          })
          .selector('edge')
          .css({
              'curve-style': 'bezier',
              'target-arrow-shape': 'triangle',
              'target-arrow-color': '#000',
              'line-color': '#000',
              'width': 1,
              'opacity': '.87'
          })
          .selector('edge[type = "linksto"]')
          .css({
            'line-style': 'dashed'
          })
          .selector('edge[type = "requiredby"]')
          .css({
            'line-color': '#69f0ae',
            'target-arrow-color': '#69f0ae'
          })
          .selector('edge[type = "blocks"]')
          .css({
            'line-color': '#f44336',
            'target-arrow-color': '#f44336'
          })
          
    });
    // Center the tree on initial load
    if (this.initialLoad) {
      pan = {x: (this.cy.width() / 2), y: 50};
    }
    this.cy.pan(pan);
    this.cy.on('tap', 'node', this.nodeClicked.bind(this));

    
    
    

    // Reselect previously selected node after each render
    if (selectedNode != null) {
      this.cy.$(selectedNode).select();
    }
    this.updateStyles();
    this.initialLoad = false;
  }
  private updateStyles() {
    this.cy.nodes('[status != "hidden"]')
      .css({'visibility': 'visible'})
      .selectify();
    this.cy.nodes('[status = "hidden"]')
      .css({'visibility': 'hidden'});
    // Set edges from non-complete nodes to hidden
    this.cy.nodes('[status = "incomplete"], [status = "attempted"], [status = "hidden"]')
      .outgoers('edge')
      .css({'visibility': 'hidden'});
    // Set unlock edges from complete nodes to visible
    this.cy.nodes('[status = "complete"]')
      .outgoers('edge[type = "unlocks"]')
      .css({'visibility': 'visible'});
    // Set requiredby edges from visible nodes to visible
    this.cy.nodes('[status != "hidden"]')
      .outgoers('edge[type = "requiredby"]')
      .css({'visibility': 'visible'});
    // Set requiredby edges from complete nodes to hidden (requirement met)
    this.cy.nodes('[status = "complete"]')
      .outgoers('edge[type = "requiredby"]')
      .css({'visibility': 'hidden'});
    // Set blocks edges from complete nodes to visible
    this.cy.nodes('[status = "complete"]')
      .outgoers('edge[type = "blocks"]')
      .css({'visibility': 'visible'});
    // Set blocks edges to complete nodes to hidden (completed nodes cannot be blocked)
    this.cy.nodes('[status = "complete"]')
      .incomers('edge[type = "blocks"]')
      .css({'visibility': 'hidden'});
    // Set edges coming into hidden nodes to be hidden (cleans up edges to nothing)
    this.cy.nodes('[status = "hidden"]')
      .incomers('edge')
      .css({'visibility': 'hidden'});
    // Incomplete nodes are black
    this.cy.nodes('[status = "incomplete"]').css({
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
    // selected nodes are pink
    this.cy.nodes(':selected').css({
        'color': '#ff4081',
        'background-color': '#ff4081',
        'border-width': '0px'
    });
    // Scenarios blocked by other scenarios being incomplete are grey
    this.cy.nodes('[status != "complete"]')
      .outgoers('edge[type = "requiredby"]')
      .targets('node[status != "complete"]')
      .css({
        'background-color': '#c9c9c9',
        'border-width': '0px'
      })
      .unselectify();
    // Scenarios blocked by other scenarios being complete are red
    this.cy.nodes('[status = "complete"]')
      .outgoers('edge[type = "blocks"]')
      .targets('node[status != "complete"]')
      .css({
        'background-color': '#f44336',
        'border-width': '0px'
      })
      .unselectify();
  }
  private nodeClicked(e) {
    var scenario = e.target;
    if (scenario.selectable()) {
      this.selectScenario.emit(scenario);
      window.setTimeout(() => this.updateStyles(), 50);
    }
  }

}
