import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LegislaturaResponse } from './legislatura-response';

@Injectable({
  providedIn: 'root'
})
export class LegislaturaService {

  private baseUrl = 'https://dadosabertos.camara.leg.br/api/v2/legislaturas';

  constructor(private http: HttpClient) { }

  GetAll(){
    return this.http.get<LegislaturaResponse>(this.baseUrl, {responseType: 'json'});
  }
}
