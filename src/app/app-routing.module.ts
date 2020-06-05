import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainChartComponent } from './main-chart/main-chart.component';
import { CompararPartidosComponent } from './comparar-partidos/comparar-partidos.component';


const routes: Routes = [
  {path: 'analise-deputado', component: MainChartComponent},
  {path: 'comparar-partidos', component: CompararPartidosComponent},
  {path: '', redirectTo: '/analise-deputado', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
