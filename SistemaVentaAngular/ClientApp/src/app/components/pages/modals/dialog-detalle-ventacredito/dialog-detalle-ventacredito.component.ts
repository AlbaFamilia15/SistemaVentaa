import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DetalleVentasCredito } from '../../../../interfaces/detalle-ventas-credito';
import { VentasCredito } from '../../../../interfaces/ventas-credito';

@Component({
  selector: 'app-dialog-detalle-ventacredito',
  templateUrl: './dialog-detalle-ventacredito.component.html',
  styleUrls: ['./dialog-detalle-ventacredito.component.css']
})
export class DialogDetalleVentacreditoComponent implements OnInit {

  fechaRegistro?: string = "";
  numero?: string = "";
  tipoPago?: string = "";
  total?: string = "";
  detalleVentasCredito: DetalleVentasCredito[] = [
    { idProducto: 1, descripcionProducto: "", cantidad: 0, cantidadML: 0, precioTexto: "0", totalTexto: "0", customerName: "" },
  ]
  displayedColumns: string[] = ['producto', 'cantidad', 'cantidadML', 'precio', 'total', 'customerName'];


  constructor(@Inject(MAT_DIALOG_DATA) public _venta: VentasCredito) {
    this.fechaRegistro = _venta.fechaRegistro;
    this.numero = _venta.numeroDocumento;
    this.tipoPago = _venta.tipoPago;
    this.total = _venta.totalTexto ? 'RD$ ' + _venta.totalTexto : _venta.totalTexto;
    this.detalleVentasCredito = _venta.detalleVentasCredito == null ? [
      { idProducto: 1, descripcionProducto: "", cantidad: 0, cantidadML: 0, precioTexto: "0", totalTexto: "0", customerName: "" },
    ] : _venta.detalleVentasCredito;
  }

  ngOnInit(): void {

  }
}
