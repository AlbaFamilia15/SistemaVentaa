import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import { ReporteVenta } from '../../../interfaces/reporte-venta';
import * as XLSX from 'xlsx';
import * as moment from 'moment';
import { MatSnackBar } from '@angular/material/snack-bar';
import { VentaService } from '../../../services/venta.service';
import { Reporte } from '../../../interfaces/reporte';
import { DialogDaysFilterComponent } from '../modals/dialog-days-filter/dialog-days-filter.component';
import { MatDialog } from '@angular/material/dialog';

export const MY_DATE_FORMATS = {
  parse: {
    dateInput: 'DD/MM/YYYY',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY'
  }
};


@Component({
  selector: 'app-reportes',
  templateUrl: './reportes.component.html',
  styleUrls: ['./reportes.component.css'],
  providers: [
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS }
  ]
})


export class ReportesComponent implements OnInit {
  formGroup: FormGroup;
  ELEMENT_DATA: Reporte[] = [];
  displayedColumns: string[] = ['fechaRegistro', 'tipoPago', 'total', 'producto', 'cantidad', 'precio', 'totalProducto'];
  dataSource = new MatTableDataSource(this.ELEMENT_DATA);
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  totalVentas: any = 'RD$ 0.00';
  totalBeneficio: any = 'RD$ 0.00';
  day: any = 'Day';

  constructor(
    private fb: FormBuilder,
    private _ventaServicio: VentaService,
    private dialog: MatDialog,
    private _snackBar: MatSnackBar,
  ) {
    this.formGroup = this.fb.group({
      fechaInicio: ['', Validators.required],
      fechaFin: ['', Validators.required]
    })

  }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }
  onSubmitForm() {
    this.day = "Day"
    const _fechaInicio: any = moment(this.formGroup.value.fechaInicio).format('DD/MM/YYYY')
    const _fechaFin: any = moment(this.formGroup.value.fechaFin).format('DD/MM/YYYY')
    if (_fechaInicio === "Invalid date" || _fechaFin === "Invalid date") {
      this._snackBar.open("Debe ingresar ambas fechas", 'Oops!', { duration: 2000 });
      return;
    }

    this._ventaServicio.reporte(
      _fechaInicio,
      _fechaFin,
    ).subscribe({
      next: (data) => {

        if (data.status) {
          data.value.forEach((element: any) => {
            if (element.cost) {
              if (element.idCategoria !== 2) {
                const calculatedValue = element.cost * element.cantidad;
                const newValue = (calculatedValue > Number(element.total)) ?
                  (calculatedValue - element.total).toFixed(2) :
                  (element.total - calculatedValue).toFixed(2);
                element.beneficio =  newValue;
              }
              else {
                const calculatedValue = element.cost;
                const newValue = (calculatedValue > Number(element.total)) ?
                  (calculatedValue - element.total).toFixed(2) :
                  (element.total - calculatedValue).toFixed(2);
                element.beneficio =  newValue;
              }
            } else {
              element.beneficio = element.total ?  element.total : '0.00';
            }
          });
          this.ELEMENT_DATA = data.value;
          this.dataSource.data = data.value;
          if (data.totalVentas) { this.totalVentas = 'RD$ ' + data.totalVentas.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }
          this.totalBeneficio = data.value.reduce((total: any, element: any) => {
            // const beneficio = element.cost ? (element.cost > element.total ? element.cost - element.total : element.total - element.cost) : element.total;
            const beneficio = element.beneficio;
            return total + Number(beneficio);
          }, 0);
          this.totalBeneficio = 'RD$ ' + this.totalBeneficio.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
        }
        else {
          this.ELEMENT_DATA = [];
          this.dataSource.data = [];
          this.totalVentas = 'RD$ 0.00';
          this.totalBeneficio = 'RD$ 0.00';

          this._snackBar.open("No se encontraron datos", 'Oops!', { duration: 2000 });
        }

      },
      error: (e) => {
      },
      complete: () => {

      }
    })

  }

  exportarExcel() {
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(this.ELEMENT_DATA);

    XLSX.utils.book_append_sheet(wb, ws, "Reporte");
    XLSX.writeFile(wb, "Reporte Ventas.xlsx")
  }
  daysFilter() {
    this.dialog.open(DialogDaysFilterComponent, {
      disableClose: true,
    }).afterClosed().subscribe((result) => {
      this.day = result.descripcion
      const _fechaInicio: any = moment(this.formGroup.value.fechaInicio).format('DD/MM/YYYY')
      const _fechaFin: any = moment(this.formGroup.value.fechaFin).format('DD/MM/YYYY')
      if (_fechaInicio === "Invalid date" || _fechaFin === "Invalid date") {
        this._snackBar.open("Debe ingresar ambas fechas", 'Oops!', { duration: 2000 });
        return;
      }

      this._ventaServicio.dayreporte(
        _fechaInicio,
        _fechaFin,
        result?.id).subscribe({
          next: (data) => {

            if (data.status) {

              data.value.forEach((element: any) => {
                if (element.cost) {
                  if (element.idCategoria !== 2) {
                    const calculatedValue = element.cost * element.cantidad;
                    const newValue = (calculatedValue > element.total) ?
                      (calculatedValue - Number(element.total)).toFixed(2) :
                      (element.total - calculatedValue).toFixed(2);
                    element.beneficio =  newValue;
                  }
                  else {
                    const calculatedValue = element.cost;
                    const newValue = (calculatedValue > element.total) ?
                      (calculatedValue - Number(element.total)).toFixed(2) :
                      (element.total - calculatedValue).toFixed(2);
                    element.beneficio =  newValue;
                  }
                } else {
                  element.beneficio = element.total ?  element.total : '0.00';
                }
              });
              this.ELEMENT_DATA = data.value;
              this.dataSource.data = data.value;
              if (data.totalVentas) { this.totalVentas = 'RD$ ' + data.totalVentas.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) }
              this.totalBeneficio = data.value.reduce((total: any, element: { cost: number; total: number; }) => {
                const beneficio = element.cost ? (element.cost > element.total ? element.cost - element.total : element.total - element.cost) : element.total;
                return total + Number(beneficio);
              }, 0);
              this.totalBeneficio = 'RD$ ' + this.totalBeneficio.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
            }
            else {
              this.ELEMENT_DATA = [];
              this.dataSource.data = [];
              this.totalVentas = 'RD$ 0.00';
              this.totalBeneficio = 'RD$ 0.00';

              this._snackBar.open("No se encontraron datos", 'Oops!', { duration: 2000 });
            }

          },
          error: (e) => {
          },
          complete: () => {

          }
        })
    });
  }
}
