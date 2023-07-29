import { DetalleVentasCredito } from "./detalle-ventas-credito";

export interface VentasCredito {
  idVenta?: number,
  numeroDocumento?: string,
  fechaRegistro?: string,
  cantidadML: string,
  tipoPago?: string,
  totalTexto?: string,
  detalleVentasCredito?: DetalleVentasCredito[]
}
