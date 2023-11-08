import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Categoria } from '../../../../interfaces/categoria';
import { CategoriaService } from '../../../../services/categoria.service';

@Component({
  selector: 'app-dialog-categoria',
  templateUrl: './dialog-categoria.component.html',
  styleUrls: ['./dialog-categoria.component.css']
})
export class DialogCategoriaComponent implements OnInit {
  formCategoria: FormGroup;
  accion: string = "Agregar"
  accionBoton: string = "Guardar";

  constructor(
    private dialogoReferencia: MatDialogRef<DialogCategoriaComponent>,
    @Inject(MAT_DIALOG_DATA) public CategoriaEditar: Categoria,
    private fb: FormBuilder,
    private _snackBar: MatSnackBar,
    private _categoriaServicio: CategoriaService,
  ) {
    this.formCategoria = this.fb.group({
      descripcion: ['', Validators.required],
    })
  }


  ngOnInit(): void {
  }

  agregarEditarCategoria() {
    const categoria: Categoria = {
      descripcion: this.formCategoria.value.descripcion
    }
    this._categoriaServicio.save(categoria).subscribe({
      next: (data) => {

        if (data.status) {
          this.mostrarAlerta("El Categoria fue registrado", "Exito");
          this.dialogoReferencia.close('agregado')
        }
        else {
          this.mostrarAlerta(data.msg, "Error");
        }

      },
      error: (e) => {
      },
      complete: () => {
      }
    })
  }

  mostrarAlerta(mensaje: string, tipo: string) {
    this._snackBar.open(mensaje, tipo, {
      horizontalPosition: "end",
      verticalPosition: "top",
      duration: 3000
    });
  }

}
