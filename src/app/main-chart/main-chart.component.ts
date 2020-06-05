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
import { Link } from '../api-client/link';

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
  gastosDeputado: GastosDeputado;
  gastosPartido: GastosDeputado[] = [];
  gastosDeputadosExtras: GastosDeputado[] = [];

  constructor(private legislaturaService: LegislaturaService, private deputadosService: DeputadosService) { 
    this.legislaturas = [];
  }

  ngOnInit() {
    this.legislaturaService.GetAll()
      .subscribe((data: Legislatura[]) => {
        this.legislaturas = data;
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
    this.searchDisabled = true;
    this.loading = true;
    this.recalculateBusy();
    this.gastosTotais = new Map<string, number>();
    this.gastosDeputado = new GastosDeputado();
    this.gastosPartido = [];
    this.gastosDeputadosExtras = [];

    this.getDespesasDeputado(this.selectedDeputado, this.gastosDeputado, (gastos) => {
      this.gastosDeputado = gastos;
      this.searchCompleted = true;
      this.recalculateBusy();
    })

    if (this.selectedDeputadosExtras?.length > 0) this.getDeputadosExtrasData();
    if (this.compareWithParty) this.getPartyData();
  }

  getDespesasRecursive(url: string, gastosDeputado: GastosDeputado, gastosCallback?: (gastos: GastosDeputado) => void){
    return this.deputadosService.GetByLink(url)
      .subscribe((data: GastoDeputadoResponse) => {
        gastosDeputado.gastos = [...gastosDeputado.gastos, ...data.dados];
        console.log(url);
        console.log(gastosDeputado.gastos);
        let nextLink = data.links.find(this.findNextLink);
        if (nextLink){
          this.getDespesasRecursive(nextLink.href, gastosDeputado, gastosCallback);
        }
        else{
          gastosCallback(gastosDeputado);
          this.recalculateBusy();
        }
      });
  }

  getDespesasDeputado(deputado: Deputado, gastosDeputado: GastosDeputado, gastosCallback?: (gastos: GastosDeputado) => void){
    gastosDeputado.deputado = deputado;
    this.deputadosService.GetDespesas(deputado, this.selectedLegislatura.id, this.selectedLegislatura.anos)
      .subscribe((data: GastoDeputadoResponse) => {
        gastosDeputado.gastos = data.dados;
        let nextLink = data.links.find(this.findNextLink);
        if (nextLink){
          this.getDespesasRecursive(nextLink.href, gastosDeputado, gastosCallback);
        }
        else{
          gastosCallback(gastosDeputado);
          this.recalculateBusy();
        }
      });
  }

  getDeputadosExtrasData(){
    for(var deputadoExtra of this.selectedDeputadosExtras){
      let gastosDeputado = new GastosDeputado();
      this.getDespesasDeputado(deputadoExtra, gastosDeputado, (gastos) => {
        this.gastosDeputadosExtras.push(gastos);
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
          let gastosDeputado = new GastosDeputado();
          this.getDespesasDeputado(deputado, gastosDeputado, (gastos) => {
            this.gastosPartido.push(gastos);
              if (this.gastosPartido.length == data.dados.length){
                this.partyDataCompleted = true;
                this.recalculateBusy();
              }
          });
        }
      });
  }

  recalculateBusy(){
    this.chartsEnabled = this.searchCompleted &&
      (!this.compareWithParty || this.partyDataCompleted) &&
      (!(this.selectedDeputadosExtras?.length > 0) ||this.searchDeputadosExtrasCompleted);
    this.loading = !(this.searchCompleted &&
      (!this.compareWithParty || this.partyDataCompleted) &&
      (!(this.selectedDeputadosExtras?.length > 0) ||this.searchDeputadosExtrasCompleted));
  }

  private findNextLink(link: Link){
    return link.rel == 'next';
  }

}
