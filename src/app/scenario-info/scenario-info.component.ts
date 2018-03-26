import { Component, OnInit, Input, Inject, OnChanges, EventEmitter, Output } from '@angular/core';
import { AssetService } from '../asset.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-scenario-info',
  templateUrl: './scenario-info.component.html',
  styleUrls: ['./scenario-info.component.css']
})
export class ScenarioInfoComponent implements OnInit, OnChanges {
  @Input() selectedScenario: any;
  @Output() updateScenario = new EventEmitter<any>();
  public scenario = {
    id: '',
    status: 'incomplete',
    notes: '',
    locked: ''
  };
  constructor(
    private assetService: AssetService, 
    public dialog: MatDialog,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit() {

  }
  ngOnChanges() {
    if (this.selectedScenario !== null) {
      this.scenario.id = this.selectedScenario.id;
      this.scenario.status = this.selectedScenario.status || "incomplete";
      this.scenario.notes = this.selectedScenario.notes || "";
      this.scenario.locked = this.selectedScenario.locked || "";
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
  public saveScenarioData(showSnackBar) {
    this.updateScenario.emit(this.scenario);
    if (showSnackBar) {
      this.snackBar.open('Scenario Saved!', '', {
        duration: 1500,
      });
    }
  }
  public unlockScenario() {
    this.scenario.locked = 'false';
    this.saveScenarioData(false);
  }
  

}

@Component({
  selector: 'app-scenario-info-dialog',
  templateUrl: './scenario-info-dialog.html',
  styles: [`
    .mat-dialog-content {
        max-height: 90vh;
    }
    #scenario-img {
      width: 100%;
    }
  `]
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