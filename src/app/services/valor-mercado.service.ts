import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ValorMercadoService {
  static valorMercado: number = 1;
  private contadorCompras = 0;
  private contadorVendas = 0;

  sobe() {
    if (this.contadorCompras >= 5) {
      ValorMercadoService.valorMercado += 0.5
      this.contadorCompras = 0;
    }
    this.contadorVendas = 0;
    this.contadorCompras++;
    console.log('subindo ' + ValorMercadoService.valorMercado)
  }

  desce() {
    if (this.contadorVendas >= 5 && ValorMercadoService.valorMercado >= 1) {
      ValorMercadoService.valorMercado -= 0.5
      this.contadorVendas = 0;
    }
    this.contadorCompras = 0;
    this.contadorVendas++;
    console.log('descendo ' + ValorMercadoService.valorMercado)
  }
}
