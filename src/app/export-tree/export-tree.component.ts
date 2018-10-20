import { Component, OnInit, Input, EventEmitter, Output, Inject } from '@angular/core';
import { FormControl, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { AssetService, ScenarioData } from '../asset.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-export-tree',
  templateUrl: './export-tree.component.html',
  styleUrls: ['./export-tree.component.css']
})
export class ExportTreeComponent implements OnInit {
  @Input() scenarios: ScenarioData;
  @Output() importScenarios = new EventEmitter<ScenarioData>();
  constructor(
    public dialog: MatDialog
  ) { }

  ngOnInit() {}

  public showImportExportModal() {
    let dialogRef = this.dialog.open(ImportExportDialog, {
      width: '600px',
      height: '75vh',
      data: { scenarios: this.scenarios }
    });
    dialogRef.afterClosed().subscribe((scenarios) => {
      if (scenarios) {
        this.importScenarios.emit(scenarios);
      }
    });
  }


}

@Component({
  selector: 'app-import-export-dialog',
  templateUrl: './import-export-dialog.html',
  styles: [`
  mat-form-field {
    width: 100%;
  }
  mat-form-field textarea {
    height: 150px;
  }
  `]
})
export class ImportExportDialog {
  public scenarios: ScenarioData;
  public encodedScenarios = new FormControl('', [Validators.required, this.validJSONValidator()]);
  public importError: String = null;

  constructor(
    public dialogRef: MatDialogRef<ImportExportDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public assetService: AssetService
  ) {
    this.scenarios = data.scenarios;
    this.encodedScenarios.setValue(JSON.stringify(this.assetService.getEncodedScenarios(this.scenarios)));
  }

  public importScenarios(): void {
    this.importError = null;
    try {
      const decodedScenarioJSON = this.assetService.getDecodedScenarios(JSON.parse(this.encodedScenarios.value));
      this.dialogRef.close(decodedScenarioJSON);
    } catch (e) {
      console.error(e);
      this.importError = "Not a valid scenario JSON.";
    }
    this.encodedScenarios.updateValueAndValidity();
  }

  private validJSONValidator(): ValidatorFn {
    return (control: AbstractControl): {[key: string]: any} => {
      return this.importError != null ? {'validJSON': {value: this.importError}} : null;
    };
  }
}
