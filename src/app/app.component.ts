import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import * as moment from 'moment';
import { ContratoModel } from './models/contrato/contrato.model';
import { ValorMercadoService } from './services/valor-mercado.service';
declare var google: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, AfterViewInit {
  title = 'book-ofertas';
  avancado = false;
  valorMercado = 0;
  qtdeContrato = 1;
  valorCompra = 0;
  listaCompras: ContratoModel[] = [];
  contrato = new ContratoModel();
  boleta: number = 0;
  alavancagem = 0;
  lucroPrejuizo = 0;
  totalContratos = 0;
  listTable = ['Boleta', 'Contrato', 'Data Compra', 'Valor Mercado', 'Data venda', 'Preço Compra', 'Preço Venda']

  constructor(private valorMercadoService: ValorMercadoService) {

  }

  ngOnInit() {
    this.valorMercado = ValorMercadoService.valorMercado;
    this.valorCompra = ValorMercadoService.valorMercado * this.qtdeContrato
  }

  addContratos() {
    this.qtdeContrato++;
    this.valorCompra = ValorMercadoService.valorMercado * this.qtdeContrato
  }

  removeContratos() {
    if (this.qtdeContrato > 1)
      this.qtdeContrato--;
    this.valorCompra = ValorMercadoService.valorMercado * this.qtdeContrato

  }

  comprar(qtdeContratos: any) {
    for (let index = 0; index < qtdeContratos.value; index++) {
      this.valorMercadoService.sobe();
      this.valorMercado = ValorMercadoService.valorMercado;
      this.valorCompra = this.valorMercado;
      this.criarContrato(true);
    }
    if (this.listaCompras.length >= 100) {
      this.listaCompras = [];
    }
  }

  vender(qtdeContratos: any) {
    for (let index = 0; index < qtdeContratos.value; index++) {
      this.valorMercadoService.desce();
      this.valorMercado = ValorMercadoService.valorMercado;
      this.criarContrato(false);
    }
    if (this.listaCompras.length >= 100) {
      this.listaCompras = [];
    }
  }

  fechar() {
    this.listaCompras = [];
  }

  processarLucroPrejuizo(contrato: ContratoModel) {
    let total = 0;
    this.totalContratos += contrato.qtdeContratos;

    if (contrato.qtdeContratos > 1 || contrato.qtdeContratos < -1) {
      total = contrato.valorCompra * contrato.qtdeContratos
      contrato.valorCompra = total;
    }

    this.listaCompras.push(this.contrato);

    let media = this.listaCompras.reduce((value, compra) => compra.valorCompra + value, 0);
    media += this.listaCompras.reduce((value, venda) => venda.valorVenda + value, 0);

    this.lucroPrejuizo = (media / this.totalContratos)
  }

  contId = 0;
  criarContrato(value: boolean) {
    this.contId++;
    this.contrato = new ContratoModel();
    this.contrato.setid(this.contId);

    if (value) {
      this.contrato.setQtdeContratos(1);
      this.contrato.setValorCompra(this.valorMercado);
      this.contrato.setDataCompra(moment(new Date()).format('L'));

    } else {
      this.contrato.setDataVenda(moment(new Date()).format('L'));
      this.contrato.setQtdeContratos(-1);
      this.contrato.setValorVenda(this.valorMercado);
    }

    this.processarLucroPrejuizo(this.contrato);
  }


  @ViewChild('areaChart') pieChart: any;
  drawChart = () => {
    const data = google.visualization.arrayToDataTable([
      ["Ago", 11, 28, 38, 15, 68, 22, 76, 15, 31, 38, 55, 66, 77],
      ["Tue", 31, 38, 55, 66, 77, 19, 66, 50, 15, 68, 22, 76, 11],
      ["Wed", 50, 55, 77, 80, 45, 68, 66, 22, 31, 38, 55, 66, 32],
      ["Thu", 77, 77, 66, 50, 55, 77, 80, 45, 66, 22, 15, 41, 99],
      ["Fri", 68, 66, 22, 15, 77, 77, 66, 50, 80, 45, 68, 66, 22]
    ], true);

    const options = {
      title: 'Area Chart',
      hAxis: { title: 'Year', titleTextStyle: { color: '#333' } },
      vAxis: { minValue: 0 },
      candlestick: {
        fallingColor: { strokeWidth: 0, fill: '#a52714' }, // red
        risingColor: { strokeWidth: 0, fill: '#0f9d58' }   // green
      }
    };

    const chart = new google.visualization.candlestickChart(this.pieChart.nativeElement);
    chart.draw(data, options);
  }

  ngAfterViewInit(): void {
    google.charts.load('current', { packages: ['corechart'] });
    google.charts.setOnLoadCallback(this.drawChart);
  }

  setAvancado() {
    this.avancado = !this.avancado
  }
}
