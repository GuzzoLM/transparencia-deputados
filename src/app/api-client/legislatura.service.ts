import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LegislaturaResponse } from './legislatura-response';
import { map } from 'rxjs/operators';
import { Legislatura } from '../entities/legislatura';

@Injectable({
  providedIn: 'root'
})
export class LegislaturaService {

  private baseUrl = 'https://dadosabertos.camara.leg.br/api/v2/legislaturas';

  constructor(private http: HttpClient) { }

  GetAll(){
    return this.http.get<LegislaturaResponse>(this.baseUrl, {responseType: 'json'})
    .pipe(
      map(
        (response: LegislaturaResponse) => {
          var legislaturas = [];
          for(var legResponse of response.dados){
            if (+legResponse.dataInicio.split('-')[0] >= 2007){
              var legislatura = new Legislatura();
              legislatura.id = legResponse.id;
              legislatura.name = legResponse.dataInicio.split('-')[0];
              legislatura.anos = this.getAnos(legResponse.dataInicio.split('-')[0], legResponse.dataFim.split('-')[0])
              legislatura.dataFim = legResponse.dataFim;
              legislatura.dataInicio = legResponse.dataInicio;
              legislaturas.push(legislatura);
            }
          }
          
          return legislaturas;
        }
      )
    );
  }

  private getAnos(anoInicio: string, anoFim: string){
    var anoInicioNumb = +anoInicio;
    var anoFimNumb = +anoFim;
    var years = []
    var year = anoInicioNumb;
    while(year <= anoFimNumb){
      years.push(year);
      year++;
    }

    return years;
  }
}
