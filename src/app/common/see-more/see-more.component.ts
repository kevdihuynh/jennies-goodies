import { Component, OnInit, Input, ElementRef, OnChanges } from '@angular/core';

@Component({
  selector: 'app-see-more',
  templateUrl: './see-more.component.html',
  styleUrls: ['./see-more.component.scss']
})
export class SeeMoreComponent implements OnChanges {
  @Input() text: string;
  @Input() maxLength = 100;
  currentText: string;
  linkText: string;
  hideToggle = true;

  public isCollapsed = true;

  constructor(private elementRef: ElementRef) { }
  toggleView() {
    this.isCollapsed = !this.isCollapsed;
    this.determineView();
  }

  determineView() {
      if (!this.text || this.text.length <= this.maxLength) {
          this.currentText = this.text;
          this.isCollapsed = false;
          this.hideToggle = true;
          return;
      }
      this.hideToggle = false;
      if (this.isCollapsed === true) {
          this.currentText = this.text.substring(0, this.maxLength) + '...';
          this.linkText = 'Read more';
      } else if (this.isCollapsed === false)  {
          this.currentText = this.text;
          this.linkText = 'Read less';
      }

  }

  ngOnChanges() {
        this.determineView();
  }

}
