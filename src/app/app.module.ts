import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import {MenubarModule} from 'primeng/menubar';
import {DropdownModule} from 'primeng/dropdown';
import {MultiSelectModule} from 'primeng/multiselect';
import {ButtonModule} from 'primeng/button';
import {CardModule} from 'primeng/card';
import {CheckboxModule} from 'primeng/checkbox';
import {FieldsetModule} from 'primeng/fieldset';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MainChartComponent } from './main-chart/main-chart.component';
import { ApiClientModule } from './api-client/api-client.module';
import { CompararPartidosComponent } from './comparar-partidos/comparar-partidos.component';
import { MainChartAreaComponent } from './main-chart/chart-area/main-chart-area.component';

@NgModule({
  declarations: [
    AppComponent,
    MainChartComponent,
    CompararPartidosComponent,
    MainChartAreaComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    FormsModule,
    ApiClientModule,
    MenubarModule,
    DropdownModule,
    MultiSelectModule,
    ButtonModule,
    CardModule,
    CheckboxModule,
    FieldsetModule
  ],
  providers: [ ],
  bootstrap: [AppComponent]
})
export class AppModule { }
