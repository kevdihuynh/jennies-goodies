import { Component, OnInit } from '@angular/core';
import { GlobalConstants } from './../../utils/global-constants';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit {
  public globalConstants = GlobalConstants;

  constructor() { }

  ngOnInit(): void {
  }

}
