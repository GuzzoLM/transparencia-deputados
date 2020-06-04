import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-main-chart',
  templateUrl: './main-chart.component.html',
  styleUrls: ['./main-chart.component.css']
})
export class MainChartComponent implements OnInit {

  legislaturas: number[];

  selectedLegislatura: number;

  constructor() { }

  ngOnInit() {
    this.legislaturas = [2007, 2010, 2014, 2018, 2022];
  }

}
