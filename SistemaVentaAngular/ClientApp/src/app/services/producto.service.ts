import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Producto } from '../interfaces/producto';
import { ResponseApi } from '../interfaces/response-api';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {
  apiBase: string = '/api/producto/'
  constructor(private http: HttpClient) {
  }


  getProductos(): Observable<ResponseApi> {

    return this.http.get<ResponseApi>(`${this.apiBase}Lista`)

  }

  save(request: Producto): Observable<ResponseApi> {

    return this.http.post<ResponseApi>(`${this.apiBase}Guardar`, request, { headers: { 'Content-Type': 'application/json;charset=utf-8' } })

  }

  edit(request: Producto): Observable<ResponseApi> {

    return this.http.put<ResponseApi>(`${this.apiBase}Editar`, request, { headers: { 'Content-Type': 'application/json;charset=utf-8' } })

  }

  delete(id: number): Observable<ResponseApi> {

    return this.http.delete<ResponseApi>(`${this.apiBase}Eliminar/${id}`);

  }
  Upload(file: File,idProducto: number) {
    const formData = new FormData();
    formData.append('file', file);
    const headers = new HttpHeaders().append('Content-Disposition','multipart/form-data')
    return this.http.post(`${this.apiBase}Upload/${idProducto}`, formData, {headers})
  }
}
