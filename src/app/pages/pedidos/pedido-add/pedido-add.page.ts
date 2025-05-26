import { Component, OnInit, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonItem, IonLabel, IonInput, IonSearchbar, ModalController, IonList, IonText, IonButtons, IonBackButton, IonFooter } from '@ionic/angular/standalone';
import { ProductoSearchModalComponent } from './producto-search-modal/producto-search-modal.component';
import { ClienteSearchModalComponent } from './cliente-search-modal/cliente-search-modal.component';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment.prod';

@Component({
  selector: 'app-pedido-add',
  templateUrl: './pedido-add.page.html',
  styleUrls: ['./pedido-add.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonButton, IonItem, IonLabel, IonInput, IonSearchbar, IonList, IonText, IonButtons, IonBackButton, IonFooter]
})
export class PedidoAddPage implements OnInit {


  cliente: any;
  productosSeleccionados: any[] = [];  // Productos seleccionados para el pedido
  valorAnteriorPrecioNeto: number[] = [];
  valorAnteriorCantidad: number[] = [];

  constructor(private modalController: ModalController, private router: Router) { }

  ngOnInit() {
  }

  // Función para abrir el modal de búsqueda de productos
  async abrirBusquedaProducto() {
    const modal = await this.modalController.create({
      component: ProductoSearchModalComponent,  // Modal de búsqueda de productos
    });

    modal.onDidDismiss().then((data) => {
      if (data.data) {
        this.agregarProductoAlPedido(data.data.producto);  // Si se seleccionó un producto, lo agregamos
      }
    });

    return await modal.present();
  }

  // Función para agregar un producto al pedido
  agregarProductoAlPedido(producto: any) {
    const productoExistente = this.productosSeleccionados.find(p => p.nombre === producto.nombre);
    if (!productoExistente) {
      const cantidad = 1;
      const subtotal = this.calcularSubtotal(producto.precioNeto, cantidad, producto.iva);
      const ivaTotal = this.calcularIva(subtotal, producto.precioNeto, cantidad);

      this.productosSeleccionados.push({
        id: producto.id,
        nombre: producto.nombre,
        precioNeto: producto.precioNeto,
        iva: producto.iva,
        cantidad: 1,
        subtotal,
        ivaTotal,
      });
    }
  }

  onChange(valor: any, index: number) {
    if (valor === '' || valor === null || valor === 0 || this.tieneDecimales(valor, 2)) {
      //No hace nada para que el usuario pueda seguir escribiendo
      return;
    } else {
      this.actualizarSubtotal(index);
    }
  }

  guardarValorAnterior(index: number) {
    const producto = this.productosSeleccionados[index];
    const cantidad = Number(producto.cantidad);
    const precioNeto = Number(producto.precioNeto);

    this.valorAnteriorCantidad[index] = isNaN(cantidad) ? 1 : cantidad;
    this.valorAnteriorPrecioNeto[index] = isNaN(precioNeto) ? 0 : precioNeto;
  }

  // Función para actualizar el subtotal cuando se cambia la cantidad
  actualizarSubtotal(index: number) {
    const producto = this.productosSeleccionados[index];
    let precioNeto = Number(producto.precioNeto);
    let cantidad = Number(producto.cantidad);

    if (isNaN(precioNeto) || precioNeto <= 0 || precioNeto > 9999999999) {
      producto.precioNeto = this.valorAnteriorPrecioNeto[index];
    }
    if (isNaN(cantidad) || cantidad <= 0 || cantidad > 9999999999) {
      producto.cantidad = this.valorAnteriorCantidad[index];
    }
    if (this.tieneDecimales(producto.precioNeto, 2)) {
      producto.precioNeto = this.recortarADecimales(producto.precioNeto, 2);
    }

    if (this.tieneDecimales(producto.cantidad, 2)) {
      producto.cantidad = this.recortarADecimales(producto.cantidad, 0);
    }

    producto.subtotal = this.calcularSubtotal(producto.precioNeto, producto.cantidad, producto.iva);
    producto.ivaTotal = this.calcularIva(producto.subtotal, producto.precioNeto, producto.cantidad);
  }

  // Función para calcular el subtotal
  calcularSubtotal(precioNeto: number, cantidad: number, iva: number) {
    const subtotal = (precioNeto * cantidad) + (precioNeto * cantidad * iva / 100);
    return Math.round(subtotal * 100) / 100;
  }

  calcularIva(subtotal: number, precioNeto: number, cantidad: number): number {
    const iva = subtotal - (precioNeto * cantidad);
    return Math.round(iva * 100) / 100;
  }

  // Función para eliminar un producto del pedido
  eliminarProducto(index: number) {
    this.productosSeleccionados.splice(index, 1);
  }

  // Función para calcular el total del pedido
  calcularTotal() {
    const total = this.productosSeleccionados.reduce((total, producto) => total + producto.subtotal, 0);
    return Math.round(total * 100) / 100;
  }



  // Función para abrir el modal de búsqueda de productos
  async abrirBusquedaCliente() {
    const modal = await this.modalController.create({
      component: ClienteSearchModalComponent,  // Modal de búsqueda de productos
    });

    modal.onDidDismiss().then((data) => {
      if (data.data) {
        this.agregarClienteAlPedido(data.data.cliente);  // Si se seleccionó un producto, lo agregamos
      }
    });

    return await modal.present();
  }

  // Función para agregar un producto al pedido
  agregarClienteAlPedido(cliente: any) {
    const clienteExistente = this.cliente == cliente;
    if (!clienteExistente) {
      this.cliente = cliente;
    }
    console.log(cliente);
  }

  eliminarCliente() {
    this.cliente = null;
  }

  crearPedido() {

    if (!this.cliente || this.productosSeleccionados.length === 0) {
      alert('Debes seleccionar un cliente y al menos un producto para crear el pedido.');
      return; // No envía si hay campos vacíos
    }

    const token = localStorage.getItem('accessToken');  // Obtener el token desde el localStorage
    if (!token) {
      console.log('No se encontró el token de acceso');
      return;
    }

    fetch(environment.apiUrl + '/pedido', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        cliente: this.cliente,
        total: this.calcularTotal(),
      })
    })
      .then(response => response.text())
      .then(data => {
        const id = Number(data.trim());
        if (!isNaN(id)) {
          alert('Pedido creado');
          this.crearDetalles(token, id, this.productosSeleccionados);
          this.router.navigate(['/pedidos']);
        } else {
          alert('Error en el registro: ' + data);
        }
      })
      .catch(error => {
        console.error('Error en la solicitud:', error);
        alert('Error en la solicitud');
      });
  }

  crearDetalles(token2: any, id: any, productos: any[]) {
    const url = environment.apiUrl + `/pedidos/${id}/detalles`;

    // Crear un array de detalles a partir de los productos
    const detalles = productos.map(producto => ({
      pedido: { id: id },
      producto: { id: producto.id, iva: producto.iva },
      precioNeto: producto.precioNeto,
      cantidad: producto.cantidad
    }));

    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token2}`,
      },
      body: JSON.stringify(detalles) //Mando un array de objetos
    })
      .then(response => response.text())
      .then(data => {
        if (data.trim() === 'Detalles creados') {
          console.log('Detalles creados');
        } else {
          alert('Error en el registro: ' + data);
        }
      })
      .catch(error => {
        console.error('Error en la solicitud:', error);
        alert('Error en la solicitud');
      });
  }

  tieneDecimales(valor: string | number, limite: number): boolean {

    //Reemplaza la coma por punto para unificar el formato decimal
    const valorNormalizado = String(valor).replace(',', '.');

    //Verifica si hay parte decimal
    const partes = valorNormalizado.split('.');

    if (partes.length < 2) {
      return false; //No hay parte decimal
    }

    const decimales = partes[1];

    return decimales.length > limite;
  }

  recortarADecimales(valor: string | number, decimales: number): number {
  const num = Number(valor.toString().replace(',', '.'));
  const factor = Math.pow(10, decimales);
  return Math.trunc(num * factor) / factor;
}
}
