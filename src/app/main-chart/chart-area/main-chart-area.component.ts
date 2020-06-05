import { Component, OnInit, Input } from '@angular/core';
import { GastoDeputado } from 'src/app/entities/gastoDeputado';
import * as c3 from 'c3';
import { Deputado } from 'src/app/entities/deputado';
import { Legislatura } from 'src/app/entities/legislatura';
import { timingSafeEqual } from 'crypto';
import { GastosDeputado } from 'src/app/entities/gastosDeputado';

@Component({
  selector: 'app-main-chart-area',
  templateUrl: './main-chart-area.component.html',
  styleUrls: ['./main-chart-area.component.css']
})
export class MainChartAreaComponent implements OnInit {

  @Input()
  gastosDeputado: GastoDeputado[];

  @Input()
  gastosPartido: GastoDeputado[][];

  @Input()
  gastosDeputadosExtras: GastosDeputado[];

  @Input()
  deputado: Deputado;

  @Input()
  deputadosExtra: Deputado[];

  @Input()
  legislatura: Legislatura;

  @Input()
  compareWithParty: boolean;

  legislaturaTimeSeries: Date[] = []

  gastosTotais = new Map<string, number>();
  gastosMensais = new Map<string, number>();

  totalLineChart: any;

  currencyFormatter = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2
  })

  constructor() { }

  ngOnInit(): void {
    this.getLegislaturaTimeseries();

    for(var gasto of this.gastosDeputado)
      this.gastosTotais.set(gasto.tipoDespesa,(this.gastosTotais.get(gasto.tipoDespesa) || 0) + gasto.valorLiquido );

    this.gastosMensais = this.groupByMonth(this.gastosDeputado);
    this.fillPieChart();
    this.fillTotalineChart();
    if (this.compareWithParty) this.addPartyToToalLineChart();
    if (this.deputadosExtra?.length > 0) this.addDeputadosExtraToLineChart();
  }

  groupByMonth(gastos: GastoDeputado[]): Map<string, number>{
    var gastosAgrupados = new Map<string, number>();
    for(var gasto of gastos){
      var date = new Date(gasto.ano, gasto.mes);
      gastosAgrupados.set(date.toString(),(gastosAgrupados.get(date.toString()) || 0) + gasto.valorLiquido );

    }
    return new Map<string, number>([...gastosAgrupados.entries()].sort());
  }

  addDeputadosExtraToLineChart(){
    let gastosMensaisDeputados = [];
    let dataDeputados = [];

    for(var gastosDeputado of this.gastosDeputadosExtras){
      gastosMensaisDeputados.push([gastosDeputado.deputado.nome, this.groupByMonth(gastosDeputado.gastos)]);
    }

    var i = 0;
    for(i = 0; i < gastosMensaisDeputados.length; i++){
      dataDeputados[i] = [gastosMensaisDeputados[i][0]];
    }

    for(var date of this.legislaturaTimeSeries){
      for(i = 0; i < gastosMensaisDeputados.length; i++){
        dataDeputados[i].push(gastosMensaisDeputados[i][1].get(date.toString()) || 0)
      }
    }

    console.log(dataDeputados);

    for(var data of dataDeputados){
      this.totalLineChart.load({
        columns: [data]
      });
    }

  }

  addPartyToToalLineChart(){
    var gastosMensais = []
    var dataPartido = [];

    for (var gastosDeputado of this.gastosPartido){
      gastosMensais.push(this.groupByMonth(gastosDeputado));
    }

    var numDeputados = gastosMensais.length;
    dataPartido = ["Gasto médio do " + this.deputado.siglaPartido];

    for(var date of this.legislaturaTimeSeries){
      var gastoTotal = 0;

      for(var gastoMensalDeputado of gastosMensais){
        gastoTotal = gastoTotal + (gastoMensalDeputado.get(date.toString()) || 0)
      }

      dataPartido.push(gastoTotal/numDeputados);
    }

    this.totalLineChart.load({
      columns: [dataPartido]
    });
  }

  
  fillTotalineChart(){
    var columns = []
    var dataDeputado = [];
    var timeseries = ['x', ...this.legislaturaTimeSeries];
    dataDeputado = [this.deputado.nome];

    for(var date of this.legislaturaTimeSeries){
      dataDeputado.push(this.gastosMensais.get(date.toString()) || 0);
    }

    columns = [timeseries, dataDeputado];

    this.totalLineChart = c3.generate({
      bindto: '#chartTotalLine',
      data: {
        x: 'x',
        columns: columns,
        type: 'line'
      },
      axis: {
        x: {
            type: 'timeseries',
            tick: {
                format: '%b-%Y'
            }
        },
        y: {
          tick: {
            format: (value) => this.currencyFormatter.format(value)
          }
        }
      }
    });
  }
  
  fillPieChart(){
    var columns = [];
    
    var i = 0;
    for(var gasto of this.gastosTotais){
      columns[i] = [gasto[0], gasto[1]];
      i++;
    }
    
    const formatter = this.currencyFormatter;
    
    var chart = c3.generate({
      bindto: '#chart',
      data: {
        columns: columns,
        type : 'pie'
      },
      legend: {
        position: 'right'
      },
      tooltip: {
        format: {
          value: function(value, ratio, id) {
            var numValue: number = +value.valueOf();
            return formatter.format(numValue);
          }
        }
      }
    });
  }

  getLegislaturaTimeseries() {
    this.legislaturaTimeSeries = [];

    var startYear = +this.legislatura.dataInicio.split('-')[0];
    var startMonth = +this.legislatura.dataInicio.split('-')[1];
    var endYear = +this.legislatura.dataFim.split('-')[0];
    var endMonth = +this.legislatura.dataFim.split('-')[1];

    
    var month = startMonth;
    var year = startYear;

    while(year < endYear || (year == endYear && month <= endMonth)){
      this.legislaturaTimeSeries.push(new Date(year, month));
      if (month < 12){
        month++;
      }
      else{
        month = 1;
        year++;
      }
    }
  }
  
  getStringDate(month: number, year: number){
    var stringMonth = '';
    switch(month){
      case 1: {
        stringMonth = 'Jan';
        break;
      }
      case 2: {
        stringMonth = 'Fev';
        break;
      }
      case 3: {
        stringMonth = 'Mar';
        break;
      }
      case 4: {
        stringMonth = 'Abr';
        break;
      }
      case 5: {
        stringMonth = 'Mai';
        break;
      }
      case 6: {
        stringMonth = 'Jun';
        break;
      }
      case 7: {
        stringMonth = 'Jul';
        break;
      }
      case 8: {
        stringMonth = 'Ago';
        break;
      }
      case 9: {
        stringMonth = 'Set';
        break;
      }
      case 10: {
        stringMonth = 'Out';
        break;
      }
      case 11: {
        stringMonth = 'Nov';
        break;
      }
      case 12: {
        stringMonth = 'Dez';
        break;
      }
      default: {
        stringMonth = 'ERROR';
        break;
      }
    }
    return year + '-' + stringMonth;
  }

}
