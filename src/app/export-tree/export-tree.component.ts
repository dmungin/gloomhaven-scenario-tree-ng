import { Component, OnInit, Input, EventEmitter, Output, Inject } from '@angular/core';
import { AssetService } from '../asset.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-export-tree',
  templateUrl: './export-tree.component.html',
  styleUrls: ['./export-tree.component.css']
})
export class ExportTreeComponent implements OnInit {
  @Input() scenarios: any;
  @Output() importScenarios = new EventEmitter();
  constructor(
    private assetService: AssetService, 
    public dialog: MatDialog
  ) { }

  ngOnInit() {
  }
  public importEncodedScenarios($event) {
    this.importScenarios.emit(this.assetService.getDecodedScenarios($event));
  }
  public exportEncodedScenarios() {
    return this.assetService.getEncodedScenarios(this.scenarios);
  }
  public showImportExportModal() {
    let dialogRef = this.dialog.open(ImportExportDialog, {
      width: '600px',
      height: '60vh',
      data: { scenarios: this.scenarios }
    });
    dialogRef.afterClosed().subscribe(() => {
      console.log('The dialog was closed');
    });
  }
  

}

@Component({
  selector: 'app-import-export-dialog',
  templateUrl: './import-export-dialog.html',
  styles: [`
    
  `]
})
export class ImportExportDialog {
  public selectedScenario: any;
  constructor(
    public dialogRef: MatDialogRef<ImportExportDialog>,
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