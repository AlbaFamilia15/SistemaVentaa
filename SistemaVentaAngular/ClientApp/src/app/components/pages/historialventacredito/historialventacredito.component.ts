import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import { Venta } from '../../../interfaces/venta';
import { MatSnackBar } from '@angular/material/snack-bar';
import * as moment from 'moment';
import { DialogDetalleVentacreditoComponent } from '../modals/dialog-detalle-ventacredito/dialog-detalle-ventacredito.component';
import { VentasCredito } from '../../../interfaces/ventas-credito';
import { VentasCreditoService } from '../../../services/ventas-credito.service';
import { DialogDeleteHistorialVentaCreditoComponent } from '../modals/dialog-delete-historialventacredito/dialog-delete-historialventacredito.component';
import { DialogConfirmationHistorialVentaCreditoComponent } from '../modals/dialog-confirmation-historialventacredito/dialog-confirmation-historialventacredito.component';


export const MY_DATE_FORMATS = {
  parse: {
    dateInput: 'DD/MM/YYYY',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY'
  },
};

@Component({
  selector: 'app-historialventacredito',
  templateUrl: './historialventacredito.component.html',
  styleUrls: ['./historialventacredito.component.css'],
  providers: [
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS }
  ]
})
export class HistorialventacreditoComponent implements OnInit {
  formGroup: FormGroup;
  buscarItem: any[] = [
    { value: "fecha", descripcion: "Por Fechas" },
    { value: "numero", descripcion: "Numero Venta" }
  ]

  ELEMENT_DATA: VentasCredito[] = [];
  displayedColumns: string[] = ['numeroVenta', 'fechaRegistro', 'tipoPago', 'total', 'isPaid', 'customerName', 'accion'];
  dataSource = new MatTableDataSource(this.ELEMENT_DATA);
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    private _ventaCreditoServicio: VentasCreditoService,
    private _snackBar: MatSnackBar,
  ) {

    this.formGroup = this.fb.group({
      buscarPor: ['fecha'],
      numero: [''],
      fechaInicio: [''],
      fechaFin: [''],
      customerName: ['']
    })

    this.formGroup.get('buscarPor')?.valueChanges.subscribe(value => {
      this.formGroup.patchValue({
        numero: "",
        fechaInicio: "",
        fechaFin: ""
      })
    })

  }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  onSubmitForm() {

    const _fechaInicio: any = moment(this.formGroup.value.fechaInicio).format('DD/MM/YYYY')
    const _fechaFin: any = moment(this.formGroup.value.fechaFin).format('DD/MM/YYYY')
    if (_fechaInicio === "Invalid date" || _fechaFin === "Invalid date") {
      this._snackBar.open("Debe ingresar ambas fechas", 'Oops!', { duration: 2000 });
      return;
    }

    this._ventaCreditoServicio.historal(
      this.formGroup.value.buscarPor,
      this.formGroup.value.numero,
      _fechaInicio,
      _fechaFin,
      this.formGroup.value.customerName,
    ).subscribe({
      next: (data) => {

        if (data.status) {

          this.dataSource.data = data.value;

        }
        else
          this._snackBar.open("No se encontraron datos", 'Oops!', { duration: 2000 });
      },
      error: (e) => {
      },
      complete: () => {

      }
    })

  }

  verDetalle(_venta: VentasCredito) {
    this.dialog.open(DialogDetalleVentacreditoComponent, {
      data: _venta,
      disableClose: true,
      width: '700px',
    })
  }

  onToggleChange(_venta: VentasCredito, newValue: boolean) {
    this.dialog.open(DialogConfirmationHistorialVentaCreditoComponent, {
      disableClose: true,
      data: _venta
    }).afterClosed().subscribe(result => {
      _venta.isPaid = !newValue;
      if (result == "confirmation") {
        _venta.isPaid = newValue;
      _venta.paidFecha =  moment(new Date()).format('DD/MM/YYYY')
      console.log(_venta.paidFecha,'date')
        this._ventaCreditoServicio.update(_venta).subscribe({
          next: (data) => {
            if (data.status) {
              this._snackBar.open("Updated successfully!!", "OK", { duration: 2000 });
            }
            else
              this._snackBar.open("Error occured while updating", 'Oops!', { duration: 2000 });
          },
          error: (e) => {
          },
          complete: () => {

          }
        })
      }
    });

  }
  eliminarVenta(_venta: VentasCredito) {
    this.dialog.open(DialogDeleteHistorialVentaCreditoComponent, {
      disableClose: true,
      data: _venta
    }).afterClosed().subscribe(result => {

      if (result === "eliminar") {
        this._ventaCreditoServicio.delete(_venta).subscribe({
          next: (data) => {

            if (data.status) {
              this.mostrarAlerta("El venta credito fue eliminado", "Listo!")
            } else {
              this.mostrarAlerta("No se pudo eliminar el venta credito", "Error");
            }

          },
          error: (e) => {
          },
          complete: () => {
          }
        })
      }
    });
  }

  mostrarAlerta(mensaje: string, tipo: string) {
    this._snackBar.open(mensaje, tipo, {
      horizontalPosition: "end",
      verticalPosition: "top",
      duration: 3000
    });
  }
}
