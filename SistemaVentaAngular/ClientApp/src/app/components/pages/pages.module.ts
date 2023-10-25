import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PagesRoutingModule } from './pages-routing.module';
import { NavigationComponent } from './navigation/navigation.component';
import { PagesComponent } from './pages.component';

import { ReusableModule } from '../reusable/reusable.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { ProductosComponent } from './productos/productos.component';
import { VenderComponent } from './vender/vender.component';
import { HistorialventaComponent } from './historialventa/historialventa.component';
import { ReportesComponent } from './reportes/reportes.component';
import { DialogUsuarioComponent } from './modals/dialog-usuario/dialog-usuario.component';
import { DialogProductoComponent } from './modals/dialog-producto/dialog-producto.component';
import { DialogDeleteUsuarioComponent } from './modals/dialog-delete-usuario/dialog-delete-usuario.component';
import { DialogDeleteProductoComponent } from './modals/dialog-delete-producto/dialog-delete-producto.component';
import { DialogDetalleVentaComponent } from './modals/dialog-detalle-venta/dialog-detalle-venta.component';
import { DialogResultadoVentaComponent } from './modals/dialog-resultado-venta/dialog-resultado-venta.component';
import { CreditSaleComponent } from './credit-sale/credit-sale.component';
import { HistorialventacreditoComponent } from './historialventacredito/historialventacredito.component';
import { DialogDetalleVentacreditoComponent } from './modals/dialog-detalle-ventacredito/dialog-detalle-ventacredito.component';
import { VentaCreditoReporteComponent } from './venta-credito-reporte/venta-credito-reporte.component';
import { DialogDeleteHistorialVentaComponent } from './modals/dialog-delete-historialventa/dialog-delete-historialventa.component'
import { DialogDeleteHistorialVentaCreditoComponent } from './modals/dialog-delete-historialventacredito/dialog-delete-historialventacredito.component';

@NgModule({
  declarations: [
    PagesComponent,
    NavigationComponent,
    DashboardComponent,
    UsuariosComponent,
    ProductosComponent,
    VenderComponent,
    HistorialventaComponent,
    ReportesComponent,
    DialogUsuarioComponent,
    DialogProductoComponent,
    DialogDeleteUsuarioComponent,
    DialogDeleteProductoComponent,
    DialogDetalleVentaComponent,
    DialogResultadoVentaComponent,
    CreditSaleComponent,
    HistorialventacreditoComponent,
    DialogDetalleVentacreditoComponent,
    VentaCreditoReporteComponent,
    DialogDeleteHistorialVentaComponent,
    DialogDeleteHistorialVentaCreditoComponent
  ],
  imports: [
    CommonModule,
    PagesRoutingModule,

    ReusableModule
  ]
})
export class PagesModule { }
