import { Component, OnInit, Input, Inject, OnChanges, EventEmitter, Output } from '@angular/core';
import { AssetService } from '../asset.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { FormControl } from '@angular/forms';
import * as cloneDeep from 'lodash.clonedeep';

@Component({
  selector: 'app-scenario-info-dialog',
  templateUrl: './scenario-info-dialog.html',
  styles: [`
    .mat-dialog-content {
        max-height: 100vh;
        padding: 0;
        margin: 0;
        width: 100%;
    }
    p {
      position: absolute;
      right: 0;
      margin: 0;
      padding: 15px;
      font-weight: 500;
      background-color: rgba(255, 255, 255, 0.3);
    }
    @media (max-width: 767px) {
      p {
        font-size: 8px;
      }
    }
    .scenario-image {
      width: 100%;
    }
  `]
})
export class ScenarioInfoDialogComponent {
  public selectedScenario: any;
  constructor(
    public dialogRef: MatDialogRef<ScenarioInfoDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public assetService: AssetService) {
      this.selectedScenario = data.selectedScenario;
    }

  close(): void {
    this.dialogRef.close();
  }
  public getNextScenarioPage() {
    const pages = this.selectedScenario.pages;
    let activeIndex = pages.indexOf(this.selectedScenario.activePage);
    activeIndex++;
    if (activeIndex === pages.length) {
      activeIndex = 0;
    }
    this.selectedScenario.activePage = pages[activeIndex];
    this.selectedScenario.imageUrl = this.assetService.getImageUrl(this.selectedScenario.activePage);
  }
}
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
  selectedTab = new FormControl(1);
  public scenario = {
    id: '',
    status: 'incomplete',
    notes: '',
    treasure: {}
  };
  public treasureArray: any[];
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
      this.scenario.status = this.selectedScenario.status || 'incomplete';
      this.scenario.notes = this.selectedScenario.notes || '';
      this.scenario.treasure = cloneDeep(this.selectedScenario.treasure);
      this.treasureArray = this.treasureArrayFromObject(this.selectedScenario.treasure);
      this.selectedTab.setValue(0);
    }
  }
  public isSideScenario() {
    return (parseInt(this.scenario.id, 10) > 51);
  }
  public showScenarioName(node) {
    return (node.data.status !== 'locked' && node.data.status !== 'hidden');
  }
  public handleStatusChange(status) {
    this.scenario.status = status;
    this.saveScenarioData(false);
  }
  public handleTreasureChange($event, id) {
    this.scenario.treasure[id].looted = $event.checked;
    this.saveScenarioData(false);
  }
  public handleScenarioSelect($event) {
    this.selectScenario.emit($event.option.value);
    this.scenarioCtrl.patchValue('');
  }
  public showScenarioModal() {
    const dialogRef = this.dialog.open(ScenarioInfoDialogComponent, {
      panelClass: 'scenario-info-dialog',
      data: { selectedScenario: this.selectedScenario }
    });
    dialogRef.afterClosed().subscribe(() => {});
  }
  public clearScenario() {
    this.scenarioCtrl.patchValue('');
    this.selectScenario.emit(null);
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
  private treasureArrayFromObject(treasureObject: any) {
    return Object.keys(treasureObject).map(number => ({
      id: number,
      looted: treasureObject[number].looted.toString() === 'true',
      description: treasureObject[number].description
    }));
  }
}
