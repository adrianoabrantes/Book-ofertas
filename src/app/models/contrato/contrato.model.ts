export class ContratoModel {
    id: number = 0;
    dataCompra: string = '';
    dataVenda: string = '';
    valorCompra: number = 0;
    valorVenda: number = 0;
    qtdeContratos: number = 0;

    constructor() {

    }
    public getid() { return this.id; }
    public setid(id: number) { this.id = id; }

    public getDataCompra() { return this.dataCompra }
    public setDataCompra(dataCompra: string) { this.dataCompra = dataCompra }

    public getDataVenda() { return this.dataVenda }
    public setDataVenda(dataVenda: string) { this.dataVenda = dataVenda }

    public getValorCompra() { return this.valorCompra }
    public setValorCompra(valorCompra: number) { this.valorCompra = valorCompra }

    public getValorVenda() { return this.valorVenda }
    public setValorVenda(valorVenda: number) { this.valorVenda = valorVenda }
    
    public getQtdeContratos() { return this.qtdeContratos }
    public setQtdeContratos(qtdeContratos: number) { this.qtdeContratos = qtdeContratos }


}