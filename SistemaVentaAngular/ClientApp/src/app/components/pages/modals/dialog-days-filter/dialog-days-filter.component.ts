import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Producto } from '../../../../interfaces/producto';

@Component({
  selector: 'app-dialog-days-filter',
  templateUrl: './dialog-days-filter.component.html',
  styleUrls: ['./dialog-days-filter.component.css']
})
export class DialogDaysFilterComponent implements OnInit {
  daysList = [
    { id: 1, descripcion: 'Monday' },
    { id: 2, descripcion: 'Tuesday' },
    { id: 3, descripcion: 'Wednesday' },
    { id: 4, descripcion: 'Thursday' },
    { id: 5, descripcion: 'Friday' },
    { id: 6, descripcion: 'Saturday' },
    { id: 7, descripcion: 'Sunday' }
  ];

  selectedDay: any;
  constructor(
    private dialogoReferencia: MatDialogRef<DialogDaysFilterComponent>,
    private _snackBar: MatSnackBar,
  ) {
  }


  ngOnInit(): void {
   
  }
  onDaySelect(dayId: number): void {
    this.selectedDay = dayId;
  }

  apply(){
    let day = this.daysList.find(x=> x.id ==  this.selectedDay)
    this.dialogoReferencia.close(day)
  }
  mostrarAlerta(mensaje: string, tipo: string) {
    this._snackBar.open(mensaje, tipo, {
      horizontalPosition: "end",
      verticalPosition: "top",
      duration: 3000
    });
  }

}
