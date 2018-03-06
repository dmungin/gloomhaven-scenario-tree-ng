import { Component, OnInit, Input, Inject, OnChanges } from '@angular/core';
import { AssetService } from '../asset.service';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';

@Component({
  selector: 'app-scenario-info',
  templateUrl: './scenario-info.component.html',
  styleUrls: ['./scenario-info.component.css']
})
export class ScenarioInfoComponent implements OnInit, OnChanges {
  @Input() selectedScenario: any;
  public scenario = {
    status: 'incomplete',
    notes: ''
  };
  constructor(
    private assetService: AssetService, 
    public dialog: MatDialog
  ) { }

  ngOnInit() {

  }
  ngOnChanges() {
    if (this.selectedScenario !== null) {
      this.scenario.status = this.selectedScenario.status || "incomplete";
      this.scenario.notes = this.selectedScenario.notes || "";
    }
  }
  public showScenarioModal() {
    let dialogRef = this.dialog.open(ScenarioInfoDialog, {
      width: '900px',
      height: '100vh',
      data: { selectedScenario: this.selectedScenario }
    });
    dialogRef.afterClosed().subscribe(() => {
      console.log('The dialog was closed');
    });
  }
  public saveScenarioData() {
    console.log(this.scenario);
  }
  

}

@Component({
  selector: 'app-scenario-info-dialog',
  templateUrl: './scenario-info-dialog.html',
})
export class ScenarioInfoDialog {
  public selectedScenario: any;
  constructor(
    public dialogRef: MatDialogRef<ScenarioInfoDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public assetService: AssetService) { 
      this.selectedScenario = data.selectedScenario;
    }

  close(): void {
    this.dialogRef.close();
  }
  public getNextScenarioPage() {
    let pages = this.selectedScenario.pages;
		var activeIndex = pages.indexOf(this.selectedScenario.activePage);
		activeIndex++;
		if (activeIndex === pages.length) {
			activeIndex = 0;
    }
    this.selectedScenario.activePage = pages[activeIndex];
    this.selectedScenario.imageUrl = this.assetService.getImageUrl(this.selectedScenario.activePage);
  }
}