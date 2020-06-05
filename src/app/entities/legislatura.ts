export class Legislatura {
    id: number;
    dataInicio: string;
    dataFim: string;
    name: string = this.dataInicio.split('-')[0] + '-' + this.dataFim.split('-')[0];
}