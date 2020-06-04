import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GastoDeputadoResponse } from './gasto-deputado-response';

@Injectable({
  providedIn: 'root'
})
export class DeputadosService {

  private baseUrl = 'https://dadosabertos.camara.leg.br/api/v2/deputados';

  constructor(private http: HttpClient) { }

  GetByLegislatura(dataInicio: string){
    var url = this.baseUrl + '?dataInicio=' + dataInicio;
    return this.http.get(url, {responseType: 'json'});
  }

  GetDespesas(idDeputado: number, idLegislatura){
    var url = this.baseUrl + "/" + idDeputado + "/despesas?idLegislatura=" + idLegislatura; 
    return this.http.get<GastoDeputadoResponse>(url, {responseType: 'json'});
  }
}
