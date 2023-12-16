export interface Producto {
  idProducto: number,
  nombre: string,
  idCategoria: number,
  descripcionCategoria: string,
  stock: number,
  precio:string,
  netPrice: number;
  isCantidad: boolean;
  image?: string;
  imagePath?: string;
  cost: number;
  precio5ML:string,
  precio10ML:string,
  precio15ML:string,
  precio30ML:string,
  precio100ML:string,
}
