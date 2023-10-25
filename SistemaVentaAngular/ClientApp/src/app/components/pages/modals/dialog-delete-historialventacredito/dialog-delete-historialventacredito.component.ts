import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { VentasCredito } from '../../../../interfaces/ventas-credito';

@Component({
  selector: 'app-dialog-delete-historialventacredito',
  templateUrl: './dialog-delete-historialventacredito.component.html',
  styleUrls: ['./dialog-delete-historialventacredito.component.css']
})
export class DialogDeleteHistorialVentaCreditoComponent implements OnInit {

  constructor(
    private dialogoReferencia: MatDialogRef<DialogDeleteHistorialVentaCreditoComponent>,
    @Inject(MAT_DIALOG_DATA) public ventaEliminar: VentasCredito
  ) { }

  ngOnInit(): void {
  }


  eliminarProducto() {
    if (this.ventaEliminar) {
      this.dialogoReferencia.close('eliminar')
    }
  }

}
