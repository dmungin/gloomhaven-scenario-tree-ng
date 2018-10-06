import { Component, OnInit, Input, Inject, OnChanges, EventEmitter, Output } from '@angular/core';
import { AssetService } from '../asset.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-scenario-info',
  templateUrl: './scenario-info.component.html',
  styleUrls: ['./scenario-info.component.css']
})
export class ScenarioInfoComponent implements OnInit, OnChanges {
  @Input()  selectedScenario: any;
  @Input()  scenarios: any;
  @Output() selectScenario = new EventEmitter();
  @Output() updateScenario = new EventEmitter<any>();
  filteredScenarios: Observable<any[]>;
  scenarioCtrl = new FormControl();
  public scenario = {
    id: '',
    status: 'incomplete',
    notes: ''
  };
  constructor(
    public dialog: MatDialog,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    this.filteredScenarios = this.scenarioCtrl.valueChanges
      .pipe(
        startWith<any>(''),
        map(value => typeof value === 'string' ? value : value.data.name),
        map(scenario => scenario ? this.filterScenarios(scenario) : this.scenarios.nodes.slice())
      );
  }
  ngOnChanges() {
    if (this.selectedScenario !== null) {
      this.scenario.id = this.selectedScenario.id;
      this.scenario.status = this.selectedScenario.status || "incomplete";
      this.scenario.notes = this.selectedScenario.notes || "";
    }
  }
  public isSideScenario() {
    return (parseInt(this.scenario.id) > 51);
  }
  public showScenarioName(node) {
    return (node.data.status !== 'locked' && node.data.status !== 'hidden');
  }
  public handleStatusChange(status) {
    this.scenario.status = status;
    this.saveScenarioData(false);
  }
  public handleScenarioSelect($event) {
    this.selectScenario.emit($event.option.value);
    this.scenarioCtrl.patchValue('');
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
  public clearScenario() {
    this.scenarioCtrl.patchValue('');
    this.selectScenario.emit(null)
  }
  public saveScenarioData(showSnackBar) {
    this.updateScenario.emit(this.scenario);
    if (showSnackBar) {
      this.snackBar.open('Notes Saved!', '', {
        duration: 1500,
      });
    }
  }
  public unlockScenario() {
    this.scenario.status = 'incomplete';
    this.saveScenarioData(false);
  }
  public lockScenario() {
    this.scenario.status = 'locked';
    this.saveScenarioData(false);
  }
  public unhideScenario() {
    this.scenario.status = 'incomplete';
    this.saveScenarioData(false);
  }
  public hideScenario() {
    this.scenario.status = 'hidden';
    this.saveScenarioData(false);
  }
  public displayFn(scenario) {
    return scenario ? scenario.data.name : undefined;
  }
  private filterScenarios(value: string) {
    const filterValue = value.toLowerCase();
    return this.scenarios.nodes.filter(node => node.data.name.toLowerCase().includes(filterValue));
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
