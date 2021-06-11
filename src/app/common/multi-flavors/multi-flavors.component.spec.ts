import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MultiFlavorsComponent } from './multi-flavors.component';

describe('MultiFlavorsComponent', () => {
  let component: MultiFlavorsComponent;
  let fixture: ComponentFixture<MultiFlavorsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MultiFlavorsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MultiFlavorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
