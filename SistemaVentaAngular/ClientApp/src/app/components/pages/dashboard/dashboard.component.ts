import { Component, OnInit } from '@angular/core';

import { Chart, registerables } from 'node_modules/chart.js';
import { DashboardService } from '../../../services/dashboard.service';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import * as moment from 'moment';
Chart.register(...registerables);
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
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  providers: [
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS }
  ]
})
export class DashboardComponent implements OnInit {
  totalIngresos: string = "0";
  totalVentas: string = "0";
  totalProductos: string = "0";
  filterValue: string = "Diario";
  totalVentasCredito: string = "0";
  startDate = "";
  endDate = "";
  totalPaidIngresos: string = "0";
  constructor(
    private _dashboardServicio: DashboardService,
  ) {


  }

  ngOnInit(): void {
    this.filterMethod();
    // this._dashboardServicio.resumen().subscribe({
    //   next: (data) => {
    //     if (data.status) {

    //       this.totalIngresos = data.value.totalIngresos;
    //       this.totalVentas = data.value.totalVentas;
    //       this.totalProductos = data.value.totalProductos;

    //       const arrayData: any[] = data.value.ventasUltimaSemana;

    //       const labelTemp = arrayData.map((value) => value.fecha);
    //       const dataTemp = arrayData.map((value) => value.total);
    //       this.mostrarGrafico(labelTemp, dataTemp)

    //     }
    //   },
    //   error: (e) => { },
    //   complete: () => { }
    // })

  }

  mostrarGrafico(labelsGrafico: any[], dataGrafico: any[]) {
    var chart = Chart.getChart('myChart'); 
    if (chart) {
      chart.destroy(); 
    }
    const myChart = new Chart('myChart', {
      type: 'bar',
      data: {
        labels: labelsGrafico,
        datasets: [{
          label: '# de Ventas',
          data: dataGrafico,
          backgroundColor: [
            'rgba(54, 162, 235, 0.2)'
          ],
          borderColor: [
            'rgba(54, 162, 235, 1)'
          ],
          borderWidth: 1
        }]
      },
      options: {
        maintainAspectRatio: false,
        responsive: true,
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }

  onFilterChange(event: any) {
 
    if (this.filterValue != 'Rangopersonalizado') {
      this.filterMethod();
    }
    if(!!this.startDate && !!this.endDate){
      this.filterMethod();
    }
  }
  filterMethod() {
    let startdate = '';
    let enddate = '';
    if (!!this.startDate) {
      startdate = moment(this.startDate).format('DD/MM/YYYY')
    }
    if (!!this.endDate) {
      enddate = moment(this.endDate).format('DD/MM/YYYY')
    }
    this._dashboardServicio.resumenFilter(this.filterValue, startdate, enddate).subscribe({
      next: (data) => {
        if (data.status) {

          this.totalIngresos =Number(data.value.totalIngresos).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
          this.totalPaidIngresos = Number(data.value.totalPaidIngresos).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
          this.totalVentas = data.value.totalVentas;
          this.totalVentasCredito = data.value.totalVentasCredito;
          this.totalProductos = data.value.totalProductos;
          const arrayData: any[] = data.value.ventasUltimaSemana;

          const labelTemp = arrayData.map((value) => value.fecha);
          const dataTemp = arrayData.map((value) => value.total);
          this.mostrarGrafico(labelTemp, dataTemp)

        }
      },
      error: (e) => { },
      complete: () => { }
    })
  }
}
