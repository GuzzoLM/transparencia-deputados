import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import {MenubarModule} from 'primeng/menubar';
import {DropdownModule} from 'primeng/dropdown';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MainChartComponent } from './main-chart/main-chart.component';

@NgModule({
  declarations: [
    AppComponent,
    MainChartComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MenubarModule,
    DropdownModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
