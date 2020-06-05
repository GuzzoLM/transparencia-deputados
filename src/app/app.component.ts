import { Component, OnInit } from '@angular/core';
import {MenuItem} from 'primeng/api';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  items: MenuItem[];
  title = 'transparencia-deputados';

  ngOnInit() {
    this.items = [
        {
            label: 'Analise de Deputado',
            icon: 'pi pi-user',
            routerLink: '/analise-deputado'
        },
        {
            label: 'Comparar Partidos',
            icon: 'pi pi-users',
            routerLink: '/comparar-partidos'
        }
    ];
}
}
