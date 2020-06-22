import { Component, OnInit } from '@angular/core';
import { GlobalConstants } from './../../utils/global-constants';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
  public globalConstants = GlobalConstants;

  constructor() { }

  ngOnInit(): void {
  }

}
