import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MainChartAreaComponent } from './main-chart-area.component';

describe('ChartAreaComponent', () => {
  let component: MainChartAreaComponent;
  let fixture: ComponentFixture<MainChartAreaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MainChartAreaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MainChartAreaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
