import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
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
  bookOfertasForm: FormGroup;

  avancado = false;
  valorMercado = 0;
  qtdeContrato = 1;
  valorCompra = 0;
  listaCompras: ContratoModel[] = [];
  contrato: ContratoModel;
  boleta: number = 0;
  alavancagem = 0;
  lucroPrejuizo = 0;
  totalContratos = 0;
  listTable = ['Boleta', 'Contrato', 'Data Compra', 'Valor Mercado', 'Data venda', 'Preço Compra', 'Preço Venda']

  constructor(private valorMercadoService: ValorMercadoService) {
    this.construirCandle()
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
    if (this.listaCompras.length >= 1000) {
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

  ngAfterViewInit(): void {

  }

  setAvancado() {
    this.avancado = !this.avancado
  }

  listaCandle: Candle[] = [];
  tempoGrafico = new FormControl();
  tempos = [
    { id: 1, nome: '1Min', tempo: 1 },
    { id: 2, nome: '5Min', tempo: 5 }
  ]

  construirCandle() {
    let timerInicio = new Date();
    let timerFim: Date;
    let entrada = this.valorMercado;
    let valorAtual = 0;
    let maxima = 0;
    let minima = 0;
    let listaValores: number[] = [];
    let tempoRestanteProgramado = 10;
    let tempoRestante = tempoRestanteProgramado;

    if (this.tempoGrafico.value == 1) {
      tempoRestanteProgramado = 60

    } else if (this.tempoGrafico.value == 1) {
      tempoRestanteProgramado = (60 * 5)
    }

    let intervalo = setInterval(() => {
      listaValores.push(this.valorMercado)
      console.log('construndo candle')
      maxima = Math.max(...listaValores);
      minima = Math.min(...listaValores);

      tempoRestante--;

      if (tempoRestante == 0) {
        this.paraIntervalo(intervalo);
        timerFim = new Date();
        valorAtual = this.valorMercado;

        console.log('timer f ' + moment(timerFim).format('HH:MM:ss'));

        this.listaCandle.push({ timerInicio, timerFim, entrada, minima, maxima, valorAtual })
        tempoRestante = tempoRestanteProgramado;
        this.construirCandle();
        this.criarGrafico();
        google.charts.load('current', { packages: ['corechart'] });
        google.charts.setOnLoadCallback(this.drawChart);
      }
    }, 1000)
  }

  paraIntervalo(intervalo: any) {
    clearInterval(intervalo);
    console.log('parou')
  }

  @ViewChild('areaChart') pieChart: any;
  drawChart: any;

  lista: any;
  criarGrafico() {
    this.lista = this.listaCandle.map(candle => [
      moment(candle.timerInicio).format('HH:MM'),
      candle.entrada,
      candle.maxima,
      candle.minima,
      candle.valorAtual
    ])

    this.drawChart = () => {
      let data = google.visualization.arrayToDataTable(
        this.lista
        , true);

      const options = {
        candlestick: {
          fallingColor: { strokeWidth: 2, stroke: '#a52714' }, // red
          risingColor: { strokeWidth: 2, stroke: '#0f9d58' }   // green

        }
      };

      let chart = new google.visualization.CandlestickChart(this.pieChart.nativeElement);
      chart.draw(data, options);
    }
  }

  teste(value: any) {
    console.log(value)
  }
}

interface Candle {
  entrada: number;
  valorAtual: number;
  maxima: number;
  minima: number;
  timerInicio: Date;
  timerFim: Date;
}
