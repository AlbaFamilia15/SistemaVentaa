import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { VentasCredito } from '../../../interfaces/ventas-credito';
import { DetalleVentasCredito } from '../../../interfaces/detalle-ventas-credito';
import { Producto } from '../../../interfaces/producto';
import { ProductoService } from '../../../services/producto.service';
import { DialogResultadoVentaComponent } from '../modals/dialog-resultado-venta/dialog-resultado-venta.component';
import { VentasCreditoService } from '../../../services/ventas-credito.service';

@Component({
  selector: 'app-credit-sale',
  templateUrl: './credit-sale.component.html',
  styleUrls: ['./credit-sale.component.css']
})
export class CreditSaleComponent implements OnInit {

  options: Producto[] = [];
  ELEMENT_DATA: DetalleVentasCredito[] = [];
  deshabilitado: boolean = false;

  filteredOptions!: Producto[];
  agregarProducto!: Producto;
  tipodePago: string = "Efectivo";
  totalPagar: number = 0;

  formGroup: FormGroup;
  displayedColumns: string[] = ['producto', 'cantidad', 'cantidadML', 'precio', 'total', 'customerName', 'accion'];
  dataSource = new MatTableDataSource(this.ELEMENT_DATA);
  cantidadML: string = "5";

  constructor(
    private fb: FormBuilder,
    private _productoServicio: ProductoService,
    private _ventasCreditoServicio: VentasCreditoService,
    private dialog: MatDialog,
    private _snackBar: MatSnackBar,

  ) {

    this.formGroup = this.fb.group({
      producto: ['', Validators.required],
      cantidad: ['', Validators.required],
      cantidadML: [''],
      customerName: ['', Validators.required]
    })

    this.formGroup.get('producto')?.valueChanges.subscribe(value => {
      this.filteredOptions = this._filter(value)
    })

    this._productoServicio.getProductos().subscribe({
      next: (data) => {
        if (data.status)
          this.options = data.value;
        console.log(data.value)
      },
      error: (e) => {
      },
      complete: () => {

      }
    })

  }

  ngOnInit(): void {

  }

  private _filter(value: any): Producto[] {
    const filterValue = typeof value === "string" ? value.toLowerCase() : value.nombre.toLowerCase();
    return this.options.filter(option => option.nombre.toLowerCase().includes(filterValue));
  }


  displayProducto(producto: Producto): string {
    return producto.nombre;
  }

  productoSeleccionado(event: any) {
    this.agregarProducto = event.option.value;
  }

  onSubmitForm() {

    //const _cantidad: number = parseFloat(this.cantidadML);
    const _cantidad: number = this.formGroup.value.cantidad;
    const _cantidadML: number = parseFloat(this.cantidadML);
    const _precio: number = parseFloat(this.agregarProducto.precio);
    const _total: number = _cantidad * _precio;
    this.totalPagar = this.totalPagar + _total;
    const _customerName: string = this.formGroup.value.customerName;

    this.ELEMENT_DATA.push({
      idProducto: this.agregarProducto.idProducto,
      descripcionProducto: this.agregarProducto.nombre,
      cantidad: _cantidad,
      cantidadML: _cantidadML,
      precioTexto: String(_precio.toFixed(2)),
      totalTexto: String(_total.toFixed(2)),
      customerName: _customerName,
    });

    this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);

    this.formGroup.patchValue({
      producto: '',
      cantidad: '',
      cantidadML: ''
    })

  }

  eliminarProducto(item: DetalleVentasCredito) {

    this.totalPagar = this.totalPagar - parseFloat(item.totalTexto);
    this.ELEMENT_DATA = this.ELEMENT_DATA.filter(p => p.idProducto != item.idProducto)

    this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);
  }

  registrarVenta() {

    if (this.ELEMENT_DATA.length > 0) {

      this.deshabilitado = true;


      const ventasCreditoDto: VentasCredito = {
        tipoPago: this.tipodePago,
        totalTexto: String(this.totalPagar.toFixed(2)),
        cantidadML: this.cantidadML,
        detalleVentasCredito: this.ELEMENT_DATA,
        isPaid: false,
      }

      this._ventasCreditoServicio.registrar(ventasCreditoDto).subscribe({
        next: (data) => {

          if (data.status) {
            this.totalPagar = 0.00;
            this.ELEMENT_DATA = [];
            this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);
            this.tipodePago = "Efectivo", "Transferencia";

            this.dialog.open(DialogResultadoVentaComponent, {
              data: {
                numero: data.value.numeroDocumento
              },
            });

          } else {
            this._snackBar.open("No se pudo registrar la venta", "Oops", {
              horizontalPosition: "end",
              verticalPosition: "top",
              duration: 3000
            });
          }
        },
        error: (e) => {
        },
        complete: () => {
          this.deshabilitado = false;
        }
      })


    }
  }

}
