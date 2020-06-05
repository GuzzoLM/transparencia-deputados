import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { GastoDeputadoResponse } from './gasto-deputado-response';
import { Deputado } from '../entities/deputado';
import { GastosDeputado } from '../entities/gastosDeputado';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DeputadosService {

  private baseUrl = 'https://dadosabertos.camara.leg.br/api/v2/deputados';

  constructor(private http: HttpClient) { }

  GetByLegislatura(idLegislatura: number){
    var url = this.baseUrl + '?idLegislatura=' + idLegislatura;
    return this.http.get(url, {responseType: 'json'});
  }

  GetDespesas(deputado: Deputado, idLegislatura: number){
    var url = this.baseUrl + "/" + deputado.id + "/despesas?idLegislatura=" + idLegislatura; 
    return this.http.get<GastoDeputadoResponse>(url, {responseType: 'json'})
      .pipe(
        map(
          (response: GastoDeputadoResponse) => {
            var gastos = new GastosDeputado();
            gastos.deputado = deputado;
            gastos.gastos = response.dados;
            return gastos;
          }
        )
      );
  }

  GetByPartidoAndLegislatura(siglaPartido: string, idLegislatura: number){
    var url = this.baseUrl + '?siglaPartido=' + siglaPartido + "&idLegislatura=" + idLegislatura;
    return this.http.get(url, {responseType: 'json'});
  }
}
