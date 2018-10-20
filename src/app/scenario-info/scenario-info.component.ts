import { Component, OnInit, Input, Inject, OnChanges, EventEmitter, Output } from '@angular/core';
import { AssetService } from '../asset.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatSnackBar } from '@angular/material';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { FormControl } from '@angular/forms';
import * as cloneDeep from 'lodash.clonedeep';
import { ScenarioData, ScenarioNode, ScenarioNodeData, ScenarioNodeStatuses, ScenarioTreasure } from '../asset.service';

@Component({
  selector: 'app-scenario-info',
  templateUrl: './scenario-info.component.html',
  styleUrls: ['./scenario-info.component.css']
})
export class ScenarioInfoComponent implements OnInit, OnChanges {
  @Input()  selectedScenario: ScenarioNodeData;
  @Input()  scenarios: ScenarioData;
  @Output() selectScenario = new EventEmitter<ScenarioNodeData>();
  @Output() updateScenario = new EventEmitter<[ScenarioNodeData, ScenarioTreasure[]]>();
  filteredScenarios: Observable<any[]>;
  scenarioCtrl = new FormControl();

  public scenario: ScenarioNodeData | null;
  public treasures: ScenarioTreasure[] = [];

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
      this.scenario = cloneDeep(this.selectedScenario);
      this.treasures = cloneDeep(this.scenarios.treasures.filter(node => {
        return this.scenario.treasure.includes(node.id);
      }));
    }
  }
  public isSideScenario() {
    return this.scenario.side;
  }
  public showScenarioName(node) {
    return (!node.data.side && node.data.status !== 'hidden');
  }
  public handleStatusChange(status: ScenarioNodeStatuses) {
    this.scenario.status = status;
    this.saveScenarioData(false);
  }
  public handleTreasureChange($event, treasure: ScenarioTreasure) {
    treasure.looted = $event.checked;
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
    dialogRef.afterClosed().subscribe(() => {});
  }
  public clearScenario() {
    this.scenarioCtrl.patchValue('');
    this.selectScenario.emit(null)
  }
  public saveScenarioData(showSnackBar) {
    this.updateScenario.emit([this.scenario, this.treasures]);
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
    this.scenario.status = 'hidden';
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
  public displayFn(scenario: ScenarioNode | null) {
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
  public selectedScenario: ScenarioNodeData;

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
