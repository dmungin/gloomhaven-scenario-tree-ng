import {Component, OnInit, EventEmitter, Output, Input} from '@angular/core';

@Component({
  selector: 'app-override',
  templateUrl: './override.component.html',
  styleUrls: ['./override.component.css']
})
export class OverrideComponent implements OnInit {
  @Input() scenarios: any;
  @Output() updateScenario = new EventEmitter<any>();
  constructor() { }

  ngOnInit() {
  }

}
