import { GastoDeputado } from '../entities/gastoDeputado';
import { Link } from './link';

export class GastoDeputadoResponse{
    dados: GastoDeputado[];
    links: Link[];
}