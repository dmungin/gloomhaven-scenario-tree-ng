import { Component, OnChanges, ElementRef, Input, Output, EventEmitter, ViewChild, AfterViewInit } from '@angular/core';
import * as cytoscape from 'cytoscape';
@Component({
  selector: 'app-cytoscape',
  template: '<div id="cy" #cy class="flex-item"></div>',
  styleUrls: ['./cytoscape.component.css']
})
export class CytoscapeComponent implements OnChanges, AfterViewInit {
  @Input() public elements: any;
  @Output() public selectScenario = new EventEmitter();
  @ViewChild('cy') cyEl;
  private cy: any;

  public constructor() {}
  public ngOnChanges(): any {
      this.render();
  }
  public ngAfterViewInit() {
    this.render();
  }
  public render() {
    this.cy = cytoscape({
        container: this.cyEl.nativeElement,
        elements: this.elements,
        zoomingEnabled: false,
        zoom: 0.5,
        pan: { x: 400, y: 50 },
        userZoomingEnabled: true,
        boxSelectionEnabled: false,
        autounselectify: true,
        autolock: true,
        layout: {
          name: "preset"
        },
        style: cytoscape.stylesheet()
          .selector('node')
          .css({
              'content': 'data(name)',
              'text-valign': 'top',
              'text-halign': 'center',
              'color': '#604729',
              'text-outline-width': 0,
              'background-color': '#604729',
              'text-outline-color': '#604729'
          })
          .selector('edge')
          .css({
              'curve-style': 'bezier',
              'target-arrow-shape': 'triangle',
              'target-arrow-color': '#604729',
              'line-color': '#604729',
              'width': 1
          })
          .selector(':selected')
          .css({
              'color': 'green',
              'line-color': 'black',
              'target-arrow-color': 'black',
              'source-arrow-color': 'black'
          })
          .selector('.faded')
          .css({
              'opacity': 0.25,
              'text-opacity': 0
          })
    });
    this.cy.on('tap', 'node', this.nodeClicked.bind(this));
  }
  private nodeClicked(e) {
      var scenario = e.target;
      this.selectScenario.emit(scenario);
      //setSelectedScenario(scenario);
      //setActivePage(scenario.data().pages[0]);
      //showScenario();
  }
}
