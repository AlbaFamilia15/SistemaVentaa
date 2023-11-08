import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { VentasCredito } from '../../../../interfaces/ventas-credito';

@Component({
  selector: 'app-dialog-confirmation-historialventacredito',
  templateUrl: './dialog-confirmation-historialventacredito.component.html',
  styleUrls: ['./dialog-confirmation-historialventacredito.component.css']
})
export class DialogConfirmationHistorialVentaCreditoComponent implements OnInit {

  constructor(
    private dialogoReferencia: MatDialogRef<DialogConfirmationHistorialVentaCreditoComponent>,
    @Inject(MAT_DIALOG_DATA) public ventaEliminar: VentasCredito
  ) { }

  ngOnInit(): void {
  }


  eliminarProducto() {
    if (this.ventaEliminar) {
      this.dialogoReferencia.close('confirmation')
    }
  }

}
