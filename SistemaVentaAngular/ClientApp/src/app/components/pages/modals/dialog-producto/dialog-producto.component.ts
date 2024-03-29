import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Categoria } from '../../../../interfaces/categoria';
import { Producto } from '../../../../interfaces/producto';
import { CategoriaService } from '../../../../services/categoria.service';
import { ProductoService } from '../../../../services/producto.service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-dialog-producto',
  templateUrl: './dialog-producto.component.html',
  styleUrls: ['./dialog-producto.component.css']
})
export class DialogProductoComponent implements OnInit {
  formProducto: FormGroup;
  accion: string = "Agregar"
  accionBoton: string = "Guardar";
  listaCategorias: Categoria[] = [];
  selectedFile: File | null = null;
  imagePath: any = "";
  isPriceML: boolean = false;

  constructor(
    private dialogoReferencia: MatDialogRef<DialogProductoComponent>,
    @Inject(MAT_DIALOG_DATA) public productoEditar: Producto,
    private fb: FormBuilder,
    private _snackBar: MatSnackBar,
    private _categoriaServicio: CategoriaService,
    private _productoServicio: ProductoService,
    private _sanitizer: DomSanitizer
  ) {
    this.formProducto = this.fb.group({
      nombre: ['', Validators.required],
      idCategoria: ['', Validators.required],
      stock: ['', Validators.required],
      precio: ['', !this.isPriceML ? Validators.required : null],
      // precion: ['', !this.isPriceML ? Validators.required : null],
      netPrice: ['', !this.isPriceML ? Validators.required : null],
      cost: ['', !this.isPriceML ? Validators.required : null],
      isCantidad: [false],
      image: [''],
      precio5ML: ['', this.isPriceML ? Validators.required : null],
      precio3ML: ['', this.isPriceML ? Validators.required : null],
      precio10ML: ['', this.isPriceML ? Validators.required : null],
      precio15ML: ['', this.isPriceML ? Validators.required : null],
      precio30ML: ['', this.isPriceML ? Validators.required : null],
      precio100ML: ['', this.isPriceML ? Validators.required : null],
      cost5ML: ['', this.isPriceML ? Validators.required : null],
      cost3ML: ['', this.isPriceML ? Validators.required : null],
      cost10ML: ['', this.isPriceML ? Validators.required : null],
      cost15ML: ['', this.isPriceML ? Validators.required : null],
      cost30ML: ['', this.isPriceML ? Validators.required : null],
      cost100ML: ['', this.isPriceML ? Validators.required : null],
    })


    if (this.productoEditar) {

      this.accion = "Editar";
      this.accionBoton = "Actualizar";
    }

    this._categoriaServicio.getCategorias().subscribe({
      next: (data) => {

        if (data.status) {

          this.listaCategorias = data.value;

          if (this.productoEditar)
            this.formProducto.patchValue({
              idCategoria: this.productoEditar.idCategoria
            })

        }
      },
      error: (e) => {
      },
      complete: () => {
      }
    })
  }


  ngOnInit(): void {
    if (this.productoEditar) {
      this.isPriceML = false;
      this.imagePath = this.productoEditar.imagePath
      if (this.productoEditar.idCategoria == 2) {
        this.isPriceML = true;
      }
      this.formProducto.patchValue({
        nombre: this.productoEditar.nombre,
        idCategoria: String(this.productoEditar.idCategoria),
        stock: this.productoEditar.stock,
        precio: this.productoEditar.precio,
        // precion: this.productoEditar.precio,
        netPrice: this.productoEditar.netPrice,
        isCantidad: this.productoEditar.isCantidad,
        image: this.productoEditar.image,
        cost: this.productoEditar.cost,
        precio5ML: this.productoEditar.precio5ML,
        precio3ML: this.productoEditar.precio3ML,
        precio10ML: this.productoEditar.precio10ML,
        precio15ML: this.productoEditar.precio15ML,
        precio30ML: this.productoEditar.precio30ML,
        precio100ML: this.productoEditar.precio100ML,
        cost5ML: this.productoEditar.cost5ML,
        cost3ML: this.productoEditar.cost3ML,
        cost10ML: this.productoEditar.cost10ML,
        cost15ML: this.productoEditar.cost15ML,
        cost30ML: this.productoEditar.cost30ML,
        cost100ML: this.productoEditar.cost100ML,
      })
      console.log(this.formProducto, 'form')
    }
  }

  agregarEditarProducto() {
    const formData = new FormData();
    if (this.formProducto.value.idCategoria == 2) {
      if (!this.formProducto.value.precio3ML ||!this.formProducto.value.precio5ML || !this.formProducto.value.precio10ML || !this.formProducto.value.precio15ML || !this.formProducto.value.precio30ML || !this.formProducto.value.precio100ML) {
        this.mostrarAlerta("Please fill all the precio ML fields", "Exito");
        return;
      }
      if (!this.formProducto.value.cost3ML ||!this.formProducto.value.cost5ML || !this.formProducto.value.cost10ML || !this.formProducto.value.cost15ML || !this.formProducto.value.cost30ML || !this.formProducto.value.cost100ML) {
        this.mostrarAlerta("Please fill all the Cost ML fields", "Exito");
        return;
      }
    }
    if (this.selectedFile) {
      let idProducto = this.productoEditar == null ? 0 : this.productoEditar.idProducto;
      formData.append('image', this.selectedFile, this.selectedFile.name);
      formData.append('idProducto', idProducto.toString())
    }
    const _producto: Producto = {
      idProducto: this.productoEditar == null ? 0 : this.productoEditar.idProducto,
      nombre: this.formProducto.value.nombre,
      idCategoria: this.formProducto.value.idCategoria,
      descripcionCategoria: "",
      precio: this.formProducto.value.precio != "" ? this.formProducto.value.precio : 0,
      precio5ML: this.formProducto.value.precio5ML != "" ? this.formProducto.value.precio5ML : 0,
      precio3ML: this.formProducto.value.precio3ML != "" ? this.formProducto.value.precio3ML : 0,
      precio10ML: this.formProducto.value.precio10ML != "" ? this.formProducto.value.precio10ML : 0,
      precio15ML: this.formProducto.value.precio15ML != "" ? this.formProducto.value.precio15ML : 0,
      precio30ML: this.formProducto.value.precio30ML != "" ? this.formProducto.value.precio30ML : 0,
      precio100ML: this.formProducto.value.precio100ML != "" ? this.formProducto.value.precio100ML : 0,
      stock: this.formProducto.value.stock,
      netPrice: this.formProducto.value.netPrice != "" ? this.formProducto.value.netPrice : 0,
      isCantidad: this.formProducto.value.isCantidad,
      cost: this.formProducto.value.cost != "" ? this.formProducto.value.cost : 0,
      cost5ML: this.formProducto.value.cost5ML != "" ? this.formProducto.value.cost5ML : 0,
      cost3ML: this.formProducto.value.cost3ML != "" ? this.formProducto.value.cost3ML : 0,
      cost10ML: this.formProducto.value.cost10ML != "" ? this.formProducto.value.cost10ML : 0,
      cost15ML: this.formProducto.value.cost15ML != "" ? this.formProducto.value.cost15ML : 0,
      cost30ML: this.formProducto.value.cost30ML != "" ? this.formProducto.value.cost30ML : 0,
      cost100ML: this.formProducto.value.cost100ML != "" ? this.formProducto.value.cost100ML : 0,
    }



    if (this.productoEditar) {

      this._productoServicio.edit(_producto).subscribe({
        next: (data) => {

          if (data.status) {

            if (this.selectedFile) {
              this._productoServicio.Upload(this.selectedFile, this.productoEditar.idProducto).subscribe({
                next: (data) => {
                  this.mostrarAlerta("El producto fue editado", "Exito");
                  this.dialogoReferencia.close('editado')
                }
              })
            }
            else {
              this.mostrarAlerta("El producto fue editado", "Exito");
              this.dialogoReferencia.close('editado')
            }
          } else {
            this.mostrarAlerta("No se pudo editar el producto", "Error");
          }

        },
        error: (e) => {
          console.log(e)
        },
        complete: () => {
        }
      })


    } else {

      this._productoServicio.save(_producto).subscribe({
        next: (data) => {

          if (data.status) {
            if (this.selectedFile) {
              this._productoServicio.Upload(this.selectedFile, data.value.idProducto).subscribe({
                next: (data) => {
                  this.mostrarAlerta("El producto fue registrado", "Exito");
                  this.dialogoReferencia.close('agregado')

                }
              })
            } else {
              this.mostrarAlerta("El producto fue registrado", "Exito");
              this.dialogoReferencia.close('agregado')
            }
          } else {
            this.mostrarAlerta("No se pudo registrar el producto", "Error");
          }

        },
        error: (e) => {
        },
        complete: () => {
        }
      })


    }
  }

  mostrarAlerta(mensaje: string, tipo: string) {
    this._snackBar.open(mensaje, tipo, {
      horizontalPosition: "end",
      verticalPosition: "top",
      duration: 3000
    });
  }

  onFileSelected(event: any) {
    this.selectedFile = <File>event.target.files[0];
    if (this.selectedFile) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagePath = e.target.result.split(',')[1];
      };

      reader.readAsDataURL(this.selectedFile);
    }
  }
  onFilterChange(event: any) {
    this.isPriceML = false;
    if (event.value == 2) {
      this.isPriceML = true;
    }
  }
}
