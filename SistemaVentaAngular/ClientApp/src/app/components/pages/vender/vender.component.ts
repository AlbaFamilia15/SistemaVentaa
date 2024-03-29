import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { DetalleVenta } from '../../../interfaces/detalle-venta';
import { Producto } from '../../../interfaces/producto';
import { Venta } from '../../../interfaces/venta';
import { ProductoService } from '../../../services/producto.service';
import { VentaService } from '../../../services/venta.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogResultadoVentaComponent } from '../modals/dialog-resultado-venta/dialog-resultado-venta.component';
import { MatSnackBar } from '@angular/material/snack-bar';




@Component({
  selector: 'app-vender',
  templateUrl: './vender.component.html',
  styleUrls: ['./vender.component.css']
})
export class VenderComponent implements OnInit {
  options: Producto[] = [];
  ELEMENT_DATA: DetalleVenta[] = [];
  deshabilitado: boolean = false;
  checkBoxValue: boolean = false;
  filteredOptions!: Producto[];
  agregarProducto!: Producto;
  tipodePago: string = "Efectivo";
  totalPagar: number = 0;
  totalVentas: number = 0;

  formGroup: FormGroup;
  displayedColumns: string[] = ['producto', 'cantidad', 'precio', 'total', 'accion'];
  dataSource = new MatTableDataSource(this.ELEMENT_DATA);
  // cantidadML: number = 5;
  cantidadML: number = 0;
  offerPrice: boolean = false;
  isNetPrice: boolean = false;
  newAgregarProducto!: Producto;
  stock: number = 0;
  isPriceML: boolean = false;

  constructor(
    private fb: FormBuilder,
    private _productoServicio: ProductoService,
    private _ventaServicio: VentaService,
    private dialog: MatDialog,
    private _snackBar: MatSnackBar,

  ) {

    this.formGroup = this.fb.group({
      producto: ['', Validators.required],
      cantidad: ['', Validators.required],
      cantidadML: [''],

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
    this.checkBoxValue = event.option.value.isCantidad ? true : false;
    this.isNetPrice = this.agregarProducto.netPrice != null ? (event.option.value.idCategoria == 2 ? false : true) : false;
    this.stock = event.option.value.stock;
    this.isPriceML = event.option.value.idCategoria == 2 ? true : false;
    if (!this.isPriceML) {
      this.totalPagar = Number(event.option.value.precio)
      // this.totalVentas = Number(event.option.value.precio) + this.totalVentas;
    } else {
      this.totalPagar = 0.00
      // this.totalVentas = 0.00
    }
    if (!this.isNetPrice) {
      this.offerPrice = false;
    }
    this.cantidadML = 0;
  }

  onSubmitForm() {
    this.checkBoxValue = false;
    let Price = this.agregarProducto.precio;
    let cost = this.agregarProducto.cost;
    let isCategoria: boolean = false;
    if (this.agregarProducto.idCategoria == 2) {
      if (this.formGroup.value.cantidad == 3) {
        isCategoria = true;
        this.agregarProducto.precio = this.agregarProducto.precio3ML;
        this.agregarProducto.cost = this.agregarProducto.cost3ML;
      } else if (this.formGroup.value.cantidad == 5) {
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
    this.agregarProducto.precio = this.offerPrice ? this.agregarProducto.netPrice.toString() : this.agregarProducto.precio;
    this.offerPrice = false;
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
    const _total: number = isCategoria ? _precio :_cantidad * _precio;
    this.totalPagar =  _total;
    this.totalVentas =  _total + this.totalVentas;

    this.ELEMENT_DATA.push({
      idProducto: this.agregarProducto.idProducto,
      descripcionProducto: this.agregarProducto.nombre,
      cantidad: _cantidad,
      cantidadML: String(_cantidadML),
      precioTexto: String(_precio.toFixed(2)),
      totalTexto: String(_total.toFixed(2)),
      cost: _cost ? String(_cost.toFixed(2)) : _cost
    });

    this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);
    this.formGroup.patchValue({
      producto: '',
      cantidad: '',
      cantidadML: ''
    })
    this.agregarProducto.precio = Price;
    this.cantidadML = 0;
  }

  eliminarProducto(item: DetalleVenta) {

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
      const ventaDto: Venta = {
        tipoPago: this.tipodePago,
        totalTexto: String(totalSum.toFixed(2)),
        detalleVenta: this.ELEMENT_DATA,
        numeroDocumento: ''
      }

      this._ventaServicio.registrar(ventaDto).subscribe({
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
    this.offerPrice = event.checked
    if (this.offerPrice) { this.totalPagar = this.agregarProducto.netPrice }
    else {
      let Price: any = Number(this.agregarProducto.precio)
      this.totalPagar = Number(Price);
      if (this.agregarProducto.idCategoria == 2 && !this.offerPrice) {
        if (this.formGroup.value.cantidad == 3) {
          Price = this.agregarProducto.precio3ML;
        } else if (this.formGroup.value.cantidad == 5) {
          Price = this.agregarProducto.precio5ML;
        } else if (this.formGroup.value.cantidad == 10) {
          Price = this.agregarProducto.precio10ML;
        } else if (this.formGroup.value.cantidad == 15) {
          Price = this.agregarProducto.precio15ML;
        } else if (this.formGroup.value.cantidad == 30) {
          Price = this.agregarProducto.precio30ML;
        } else if (this.formGroup.value.cantidad == 100) {
          Price = this.agregarProducto.precio100ML;
        }else{
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
    return this.isPriceML ? '^(3|5|10|15|30|100)$' : '^[0-9]+$';
  }
  updateTotal() {
    let Price: any = this.agregarProducto.precio;
    if (this.offerPrice) {
      this.totalPagar = this.agregarProducto.netPrice;
    }
    if (this.agregarProducto.idCategoria == 2 && !this.offerPrice) {
      if (this.formGroup.value.cantidad == 3) {
        Price = this.agregarProducto.precio3ML;
      } else if (this.formGroup.value.cantidad == 5) {
        Price = this.agregarProducto.precio5ML;
      } else if (this.formGroup.value.cantidad == 10) {
        Price = this.agregarProducto.precio10ML;
      } else if (this.formGroup.value.cantidad == 15) {
        Price = this.agregarProducto.precio15ML;
      } else if (this.formGroup.value.cantidad == 30) {
        Price = this.agregarProducto.precio30ML;
      } else if (this.formGroup.value.cantidad == 100) {
        Price = this.agregarProducto.precio100ML;
      }else{
        Price = 0.00;
      }
      this.totalPagar = Number(Price);
    }
  }
}
