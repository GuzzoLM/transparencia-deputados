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
import * as d3 from 'd3';
import { GastosDeputado } from '../entities/gastosDeputado';

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

  selectedDeputadosExtras: Deputado[];

  fetchingLegislaturas = true;

  fetchingDeputados = true;

  searchDisabled = true;

  searchCompleted = false;

  searchDeputadosExtrasCompleted = false;

  partyDataCompleted = false;

  compareWithParty = false;

  loading = false;

  chartsEnabled = this.searchCompleted && (!this.compareWithParty || this.partyDataCompleted) && this.searchDeputadosExtrasCompleted;

  gastosTotais = new Map<string, number>();
  gastosDeputado: GastoDeputado[] = [];
  gastosPartido: GastoDeputado[][] = [];
  gastosDeputadosExtras: GastosDeputado[] = [];

  constructor(private legislaturaService: LegislaturaService, private deputadosService: DeputadosService) { 
    this.legislaturas = [];
  }

  ngOnInit() {
    this.legislaturaService.GetAll()
      .subscribe((data: LegislaturaResponse) => {
        this.legislaturas = data.dados;
        this.fetchingLegislaturas = false;
      });

      
  }

  fetchDeputados(){
    this.fetchingDeputados = true;
    this.deputadosService.GetByLegislatura(this.selectedLegislatura.id)
      .subscribe((data: DeputadosResponse) => {
        this.deputados = data.dados;
        this.fetchingDeputados = false;
      });
  }

  deputadoSelected(){
    this.searchDisabled = false;
  }

  searchStarted(){
    this.searchCompleted = false;
    this.partyDataCompleted = false;
    this.searchDeputadosExtrasCompleted = false;
    this.loading = true;
    this.recalculateBusy();
    this.gastosTotais = new Map<string, number>();
    this.gastosDeputado = [];
    this.gastosPartido = [];
    this.gastosDeputadosExtras = [];

    this.deputadosService.GetDespesas(this.selectedDeputado, this.selectedLegislatura.id)
      .subscribe((data: GastosDeputado) => {
        this.searchCompleted = true;
        this.gastosDeputado = data.gastos;
        this.searchDisabled = true;
        this.recalculateBusy();
        if (this.compareWithParty) this.getPartyData();
      });
    if (this.selectedDeputadosExtras?.length > 0) this.getDeputadosExtrasData();
  }

  getDeputadosExtrasData(){
    for(var deputadoExtra of this.selectedDeputadosExtras){
      this.deputadosService.GetDespesas(deputadoExtra, this.selectedLegislatura.id)
        .subscribe((dataDeputado: GastosDeputado) => {
          this.gastosDeputadosExtras.push(dataDeputado);
          if (this.gastosDeputadosExtras.length == this.selectedDeputadosExtras.length){
            this.searchDeputadosExtrasCompleted = true;
            this.recalculateBusy();
          }
        });
    }
  }

  getPartyData(){
    this.deputadosService.GetByPartidoAndLegislatura(this.selectedDeputado.siglaPartido, this.selectedLegislatura.id)
      .subscribe((data: DeputadosResponse) => {
        for(var deputado of data.dados){
          this.deputadosService.GetDespesas(deputado, this.selectedLegislatura.id)
            .subscribe((dataDeputado: GastosDeputado) => {
              this.gastosPartido.push(dataDeputado.gastos);
              if (this.gastosPartido.length == data.dados.length){
                this.partyDataCompleted = true;
                this.recalculateBusy();
              }
            });
        }
      });
  }

  recalculateBusy(){
    this.chartsEnabled = this.searchCompleted && (!this.compareWithParty || this.partyDataCompleted) && this.searchDeputadosExtrasCompleted;
    this.loading = !(this.searchCompleted && (!this.compareWithParty || this.partyDataCompleted) && this.searchDeputadosExtrasCompleted);
  }

  

}
