export interface Producto {
  idProducto: number,
  nombre: string,
  idCategoria: number,
  descripcionCategoria: string,
  stock: number,
  precio:string,
  netPrice: number;
  isCantidad: boolean;
}
