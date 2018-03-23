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
    let pan = this.initialLoad ? { x: 525, y: 50 } : this.cy.pan();
    this.cy = cytoscape({
        container: this.cyEl.nativeElement,
        elements: this.elements,
        zoomingEnabled: false,
        zoom: 0.5,
        pan: pan,
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
          .selector('node[id > 51][status = "hidden"]')
          .css({
            'content': 'data(id)'
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
          .selector(':selected')
          .css({
              'color': '#ff4081',
              'background-color': '#ff4081',
          })
          .selector('.faded')
          .css({
              'opacity': 0.25,
              'text-opacity': 0
          })
    });
    this.cy.on('tap', 'node', this.nodeClicked.bind(this));

    if (this.hideLocked) {
      this.cy.nodes('[status != "hidden"]').css({'visibility': 'visible'});
      this.cy.nodes('[status = "hidden"][id < 52]').css({'visibility': 'hidden'});
      // Set edges to the visible only if source is complete
      this.cy.nodes('[status = "incomplete"], [status = "attempted"], [status = "hidden"]').outgoers('edge').css({'visibility': 'hidden'});

      this.cy.nodes('[status = "complete"]').outgoers('edge').css({'visibility': 'visible'});
    }
    
    this.updateStyles();
    this.initialLoad = false;
  }
  private updateStyles() {
    this.cy.nodes('[status = "incomplete"]').css({
      'color': '#000', 
      'background-color': '#000', 
      'border-width': '0px'});
    this.cy.nodes('[status = "complete"]').css({
      'color': '#3f51b5', 
      'background-color': '#3f51b5', 
      'border-width': '0px'});
    this.cy.nodes('[status = "attempted"]').css({
      'color': '#000', 
      'background-color': '#fff', 
      'border-width': '1px'});
    this.cy.nodes(':selected').css({
        'color': '#ff4081',
        'background-color': '#ff4081',
        'border-width': '0px'
    });
  }
  private nodeClicked(e) {
    var scenario = e.target;
    this.selectScenario.emit(scenario);
    window.setTimeout(() => this.updateStyles(), 50);
    console.log(e.position);
    //setSelectedScenario(scenario);
    //setActivePage(scenario.data().pages[0]);
    //showScenario();
  }

}
