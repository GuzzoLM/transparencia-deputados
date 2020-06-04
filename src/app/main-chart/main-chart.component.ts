import { Component, OnInit } from '@angular/core';
import { LegislaturaService } from '../api-client/legislatura.service';
import { Legislatura } from '../entities/legislatura';
import { LegislaturaResponse } from '../api-client/legislatura-response';
import { DeputadosService } from '../api-client/deputados.service';
import { DeputadosResponse } from '../api-client/deputados-response';
import { Deputado } from '../entities/deputado';
import { GastoTotal } from '../entities/gastoTotal';
import { GastoDeputadoResponse } from '../api-client/gasto-deputado-response';

import * as c3 from "c3";
import { GastoDeputado } from '../entities/gastoDeputado';

@Component({
  selector: 'app-main-chart',
  templateUrl: './main-chart.component.html',
  styleUrls: ['./main-chart.component.css']
})
export class MainChartComponent implements OnInit {

  legislaturas: Legislatura[];

  selectedLegislatura: Legislatura;

  deputados: Deputado[];

  selectedDeputado: Deputado;

  fetchingLegislaturas = true;

  fetchingDeputados = true;

  searchDisabled = true;

  gastosTotais = new Map<string, number>();
  gastosDeputado: GastoDeputado[] = [];

  constructor(private legislaturaService: LegislaturaService, private deputadosService: DeputadosService) { 
    this.legislaturas = [];
  }

  ngOnInit() {
    this.legislaturaService.GetAll()
      .subscribe((data: LegislaturaResponse) => {
        console.log(data);
        this.legislaturas = data.dados;
        this.fetchingLegislaturas = false;
      });

      
  }

  fetchDeputados(){
    this.fetchingDeputados = true;
    this.deputadosService.GetByLegislatura(this.selectedLegislatura.dataInicio)
      .subscribe((data: DeputadosResponse) => {
        this.deputados = data.dados;
        this.fetchingDeputados = false;
      });
  }

  deputadoSelected(){
    this.searchDisabled = false;
  }

  searchStarted(){
    this.gastosTotais = new Map<string, number>();
    this.deputadosService.GetDespesas(this.selectedDeputado.id, this.selectedLegislatura.id)
      .subscribe((data: GastoDeputadoResponse) => {
        this.gastosDeputado = data.dados;
        for(var gasto of data.dados)
          this.gastosTotais.set(gasto.tipoDespesa,(this.gastosTotais.get(gasto.tipoDespesa) || 0) + gasto.valorLiquido );

        console.log(this.gastosTotais);
        this.searchDisabled = true;
        this.fillPieChart();
      });
  }

  fillPieChart(){
    var columns = [];

    var i = 0;
    for(var gasto of this.gastosTotais){
      columns[i] = [gasto[0], gasto[1]];
      i++;
    }

    var chart = c3.generate({
      bindto: '#chart',
      data: {
        columns: columns,
        type : 'pie'
      },
      legend: {
        position: 'right'
      }
  });
  }

}
