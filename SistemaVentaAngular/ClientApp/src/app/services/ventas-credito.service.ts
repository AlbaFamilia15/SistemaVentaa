import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ResponseApi } from '../interfaces/response-api';
import { Observable } from 'rxjs';
import { VentasCredito } from '../interfaces/ventas-credito';

@Injectable({
  providedIn: 'root'
})
export class VentasCreditoService {
  apiBase: string = '/api/ventasCredito/'
  constructor(private http: HttpClient) { }

  registrar(request: VentasCredito): Observable<ResponseApi> {

    return this.http.post<ResponseApi>(`${this.apiBase}Registrar`, request, { headers: { 'Content-Type': 'application/json;charset=utf-8' } })

  }

  historal(buscarPor: string, numeroVenta: string, fechaInicio: string, fechaFin: string, customerName: string): Observable<ResponseApi> {

    return this.http.get<ResponseApi>(`${this.apiBase}Historial?buscarPor=${buscarPor}&numeroVenta=${numeroVenta}&fechaInicio=${fechaInicio}&fechaFin=${fechaFin}&customerName=${customerName}`);

  }

  reporte(fechaInicio: string, fechaFin: string): Observable<ResponseApi> {

    return this.http.get<ResponseApi>(`${this.apiBase}Reporte?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`);

  }
  dayreporte(fechaInicio: string, fechaFin: string,day: any): Observable<ResponseApi> {

    return this.http.get<ResponseApi>(`${this.apiBase}DayReporte?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}&day=${day}`);

  }
  update(request: VentasCredito): Observable<ResponseApi> {

    return this.http.post<ResponseApi>(`${this.apiBase}update`, request, { headers: { 'Content-Type': 'application/json;charset=utf-8' } })

  }

  delete(request: VentasCredito): Observable<ResponseApi> {

    return this.http.post<ResponseApi>(`${this.apiBase}Delete`, request, { headers: { 'Content-Type': 'application/json;charset=utf-8' } })
 
  }
}
