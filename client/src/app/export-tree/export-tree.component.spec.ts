import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExportTreeComponent } from './export-tree.component';

describe('ExportTreeComponent', () => {
  let component: ExportTreeComponent;
  let fixture: ComponentFixture<ExportTreeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExportTreeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExportTreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
