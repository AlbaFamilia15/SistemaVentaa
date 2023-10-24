import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Venta } from '../../../../interfaces/venta';

@Component({
  selector: 'app-dialog-delete-historialventa',
  templateUrl: './dialog-delete-historialventa.component.html',
  styleUrls: ['./dialog-delete-historialventa.component.css']
})
export class DialogDeleteHistorialVentaComponent implements OnInit {

  constructor(
    private dialogoReferencia: MatDialogRef<DialogDeleteHistorialVentaComponent>,
    @Inject(MAT_DIALOG_DATA) public ventaEliminar: Venta
  ) { }

  ngOnInit(): void {
  }


  eliminarProducto() {
    if (this.ventaEliminar) {
      this.dialogoReferencia.close('eliminar')
    }
  }

}
