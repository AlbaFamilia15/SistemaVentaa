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
  totalVentas: number = 0;

  formGroup: FormGroup;
  displayedColumns: string[] = ['producto', 'cantidad', 'precio', 'total', 'customerName', 'accion'];
  dataSource = new MatTableDataSource(this.ELEMENT_DATA);
  // cantidadML: string = "5";
  cantidadML: string = "";
  checkBoxValue: boolean = false;
  isNetPrice: boolean = false;
  stock: number = 0;
  isPriceML: boolean = false;

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
      customerName: ['', Validators.required],
      offerPrice: [false]
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
    this.stock = 0;
    this.agregarProducto = event.option.value;
    this.checkBoxValue = event.option.value.isCantidad ? true : false
    this.isNetPrice = this.agregarProducto.netPrice != null ? (event.option.value.idCategoria == 2 ? false : true) : false;
    this.stock = event.option.value.stock;
    this.isPriceML = event.option.value.idCategoria == 2 ? true : false;
    if (!this.isPriceML) {
      this.totalPagar = Number(event.option.value.precio)
    } else {
      this.totalPagar = 0.00
    }
    if (!this.isNetPrice) {
      this.formGroup.controls['offerPrice'].setValue(false)
    }
    this.cantidadML = "";
  }

  onSubmitForm() {
    this.checkBoxValue = false;
    let Price = this.agregarProducto.precio;
    let cost = this.agregarProducto.cost;
    let isCategoria: boolean = false;
    if (this.agregarProducto.idCategoria == 2) {
      if (this.formGroup.value.cantidad == 5) {
        isCategoria = true;
        this.agregarProducto.precio = this.agregarProducto.precio5ML;
        this.agregarProducto.cost = this.agregarProducto.cost5ML;
      } else if (this.formGroup.value.cantidad == 10) {
        isCategoria = true;
        this.agregarProducto.precio = this.agregarProducto.precio10ML;
        this.agregarProducto.cost = this.agregarProducto.cost10ML;
      } else if (this.formGroup.value.cantidad == 15) {
        isCategoria = true;
        this.agregarProducto.precio = this.agregarProducto.precio15ML;
        this.agregarProducto.cost = this.agregarProducto.cost15ML;
      } else if (this.formGroup.value.cantidad == 30) {
        isCategoria = true;
        this.agregarProducto.precio = this.agregarProducto.precio30ML;
        this.agregarProducto.cost = this.agregarProducto.cost30ML;
      } else if (this.formGroup.value.cantidad == 100) {
        isCategoria = true;
        this.agregarProducto.precio = this.agregarProducto.precio100ML;
        this.agregarProducto.cost = this.agregarProducto.cost100ML;
      } else {
        this.agregarProducto.precio = Price;
        this.agregarProducto.cost = cost;
      }
    }
    this.agregarProducto.precio = this.formGroup.controls['offerPrice'].value ? this.agregarProducto.netPrice.toString() : this.agregarProducto.precio
    this.formGroup.controls['offerPrice'].setValue(false)
    this.isNetPrice = false;
    if (this.agregarProducto.stock < this.formGroup.value.cantidad) {
      this._snackBar.open("Product stock is not available", "Oops", {
        horizontalPosition: "center",
        verticalPosition: "top",
        duration: 3000
      });
      //return;
    }

    //const _cantidad: number = parseFloat(this.cantidadML);
    const _cantidad: number = this.formGroup.value.cantidad;
    const _cantidadML: number = parseFloat(String(this.stock));
    const _precio: number = parseFloat(this.agregarProducto.precio);
    const _cost: any = this.agregarProducto.cost;
    const _total: number = isCategoria ? _precio : _cantidad * _precio;
    // this.totalPagar = this.totalPagar + _total;
    const _customerName: string = this.formGroup.value.customerName;
    this.totalVentas =  _total + this.totalVentas;

    this.ELEMENT_DATA.push({
      idProducto: this.agregarProducto.idProducto,
      descripcionProducto: this.agregarProducto.nombre,
      cantidad: _cantidad,
      cantidadML: _cantidadML,
      precioTexto: String(_precio.toFixed(2)),
      totalTexto: String(_total.toFixed(2)),
      customerName: _customerName,
      cost: _cost ? String(_cost.toFixed(2)) : _cost
    });

    this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);
    this.agregarProducto.precio = Price;

    this.formGroup.patchValue({
      producto: '',
      cantidad: '',
      cantidadML: ''
    })
    this.cantidadML = "";
  }

  eliminarProducto(item: DetalleVentasCredito) {

    this.totalPagar = this.totalPagar - parseFloat(item.totalTexto);
    this.totalVentas = this.totalVentas - parseFloat(item.totalTexto);
    this.ELEMENT_DATA = this.ELEMENT_DATA.filter(p => p.idProducto != item.idProducto)

    this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);
  }

  registrarVenta() {

    if (this.ELEMENT_DATA.length > 0) {

      this.deshabilitado = true;

      const totalSum = this.ELEMENT_DATA.reduce((acc, record) => {
        return acc + parseFloat(record.totalTexto);
      }, 0);
      const ventasCreditoDto: VentasCredito = {
        tipoPago: this.tipodePago,
        totalTexto: String(totalSum.toFixed(2)),
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
            this.totalVentas = 0.00;
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
  changeOfferPrice(event: any) {
    let offerPrice = event.checked
    this.formGroup.controls['offerPrice'].setValue(event.checked)
    if (offerPrice) { this.totalPagar = this.agregarProducto.netPrice }
    else {
      let Price: any = Number(this.agregarProducto.precio)
      this.totalPagar = Number(Price);
      if (this.agregarProducto.idCategoria == 2 && !offerPrice) {
        if (this.formGroup.value.cantidad == 5) {
          Price = this.agregarProducto.precio5ML;
        } else if (this.formGroup.value.cantidad == 10) {
          Price = this.agregarProducto.precio10ML;
        } else if (this.formGroup.value.cantidad == 15) {
          Price = this.agregarProducto.precio15ML;
        } else if (this.formGroup.value.cantidad == 30) {
          Price = this.agregarProducto.precio30ML;
        } else if (this.formGroup.value.cantidad == 100) {
          Price = this.agregarProducto.precio100ML;
        } else {
          Price = 0.00;
        }
        this.totalPagar = Number(Price);
      }
    }
  }
  clearSelection() {
    if (!this.formGroup.value.producto) {
      this.stock = 0;
      this.isPriceML = false;
      this.totalPagar = 0.00;
    }
  }
  getPattern(): string {
    return this.isPriceML ? '^(5|10|15|30|100)$' : '^[0-9]+$';
  }
  updateTotal() {
    let Price: any = this.agregarProducto.precio;
    if (this.formGroup.controls['offerPrice'].value) {
      this.totalPagar = this.agregarProducto.netPrice;
    }
    if (this.agregarProducto.idCategoria == 2 && !this.formGroup.controls['offerPrice'].value) {
      if (this.formGroup.value.cantidad == 5) {
        Price = this.agregarProducto.precio5ML;
      } else if (this.formGroup.value.cantidad == 10) {
        Price = this.agregarProducto.precio10ML;
      } else if (this.formGroup.value.cantidad == 15) {
        Price = this.agregarProducto.precio15ML;
      } else if (this.formGroup.value.cantidad == 30) {
        Price = this.agregarProducto.precio30ML;
      } else if (this.formGroup.value.cantidad == 100) {
        Price = this.agregarProducto.precio100ML;
      } else {
        Price = 0.00;
      }
      this.totalPagar = Number(Price);
    }
  }
}
