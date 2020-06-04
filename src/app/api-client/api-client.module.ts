import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { LegislaturaService } from './legislatura.service';
import { DeputadosService } from './deputados.service';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    HttpClientModule
  ],
  providers: [
    LegislaturaService,
    DeputadosService
  ]
})
export class ApiClientModule { }
