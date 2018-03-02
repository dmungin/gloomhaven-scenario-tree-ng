import { Component, OnInit } from '@angular/core';
import { AssetService } from './asset.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  public scenarios: any;
  public selectedScenario: any = null;
  constructor(private assetService: AssetService) {}
  ngOnInit() {
    this.assetService.getScenariosJSON().subscribe(scenarios => this.scenarios = scenarios);
  }
  public handleScenarioSelect(scenario) {
    let rawScenario = scenario.data();
    rawScenario.activePage = rawScenario.pages[0];
    rawScenario.imageUrl = this.getImageUrl(rawScenario.activePage); 
    this.selectedScenario = rawScenario;
  }
  public getNextScenarioPage() {
    let pages = this.selectedScenario.pages;
		var activeIndex = pages.indexOf(this.selectedScenario.activePage);
		activeIndex++;
		if (activeIndex === pages.length) {
			activeIndex = 0;
    }
    this.selectedScenario.activePage = pages[activeIndex];
    this.selectedScenario.imageUrl = this.getImageUrl(this.selectedScenario.activePage);
  }
  private getImageUrl(activePage) {
    return `assets/scenarios/${activePage}.jpg`; 
  }
}
