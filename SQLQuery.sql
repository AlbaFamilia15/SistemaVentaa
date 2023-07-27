
create database DBVentaAngular

go

use DBVentaAngular

go

create table Rol(
idRol int primary key identity(1,1),
descripcion varchar(50),
esActivo bit,
fechaRegistro datetime default getdate()
)

go

create table Usuario(
idUsuario int primary key identity(1,1),
nombreApellidos varchar(100),
correo varchar(40),
idRol int references Rol(idRol),
clave varchar(40),
esActivo bit
)

go

create table Categoria(
idCategoria int primary key identity(1,1),
descripcion varchar(50),
esActivo bit,
fechaRegistro datetime default getdate()
)


go 
create table Producto (
idProducto int primary key identity(1,1),
nombre varchar(100),
idCategoria int references Categoria(idCategoria),
stock int,
precio decimal(10,2),
esActivo bit,
fechaRegistro datetime default getdate()
)

go

create table NumeroDocumento(
idNumeroDocumento int primary key identity(1,1),
ultimo_Numero int not null,
fechaRegistro datetime default getdate()
)
go

create table Venta(
idVenta int primary key identity(1,1),
numeroDocumento varchar(40),
tipoPago varchar(50),
fechaRegistro datetime default getdate(),
total decimal(10,2)
)
go

create table DetalleVenta(
idDetalleVenta int primary key identity(1,1),
idVenta int references Venta(idVenta),
idProducto int references Producto(idProducto),
cantidad int,
precio decimal(10,2),
total decimal(10,2)
)



--INSERTAR ROLES
insert into rol(descripcion,esActivo) values
('Administrador',1),
('Empleado',1)

go

--INSERTAR USUARIOS
insert into usuario(nombreApellidos,correo,idRol,Clave,esActivo) values
('Alba','admin@example.com',1,'12345',1),
('Prueba','employe@example.com',2,'12345',1)

go
--INSERTAR CATEGORIAS
insert into Categoria(descripcion,esActivo) values ('Accesorios',1)
insert into Categoria(descripcion,esActivo) values ('Mods',1)
insert into Categoria(descripcion,esActivo) values ('Tanques',1)
insert into Categoria(descripcion,esActivo) values ('Desechables',1)
insert into Categoria(descripcion,esActivo) values ('Starter KIT',1)

Select * from Producto
go

--INSERTAR PRODUCTOS

insert into Producto(nombre,idCategoria,stock,precio,esActivo) values
('CARGADOR USB JUUL',1,20,2500,1),
('THE GEM FOR JUUL',1,30,2200,1),
('VANIN PODS',1,30,2100,1),
('SNOW WOLF 218W MOD',2,25,1050,1),
('REVENGER MINI TC MOD',2,15,1400,1),
('KBOX 70W MOD',2,10,1350,1),
('ZEUS SUB OHM',3,10,800,1),
('ZEUS DUAL RTA TANK',3,10,1000,1),
('ZEPHYRUS V2 ATOMIZER',3,10,1000,1),
('STIG PODS 300 PUFF',4,15,800,1),
('GEEK BAR 575 PUFF',4,20,680,1),
('HQD CUVIE PLUS 1200 PUFF',4,25,950,1),
('NORD X',5,10,200,1)

go

--INSERTAR NUMERO VENTA INICIAL
insert into NumeroDocumento(ultimo_Numero) values(0)
