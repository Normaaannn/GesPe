import { Component, OnInit, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonItem, IonLabel, IonInput, IonSearchbar, ModalController, IonList, IonText, IonButtons, IonBackButton} from '@ionic/angular/standalone';
import { ProductoSearchModalComponent } from './producto-search-modal/producto-search-modal.component';
import { ClienteSearchModalComponent } from './cliente-search-modal/cliente-search-modal.component';

@Component({
  selector: 'app-pedido-add',
  templateUrl: './pedido-add.page.html',
  styleUrls: ['./pedido-add.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonButton, IonItem, IonLabel, IonInput, IonSearchbar, IonList, IonText, IonButtons, IonBackButton]
})
export class PedidoAddPage implements OnInit {


  cliente: any;
  productosSeleccionados: any[] = [];  // Productos seleccionados para el pedido

  constructor(private modalController: ModalController) {}

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
      this.productosSeleccionados.push({
        id: producto.id,
        nombre: producto.nombre,
        precioNeto: producto.precioNeto,
        iva: producto.iva,
        cantidad: 1,
        subtotal: this.calcularSubtotal(producto.precioNeto, 1, producto.iva),
      });
    }
  }

  // Función para actualizar el subtotal cuando se cambia la cantidad
  actualizarSubtotal(index: number) {
    const producto = this.productosSeleccionados[index];
    producto.subtotal = this.calcularSubtotal(producto.precioNeto, producto.cantidad, producto.iva);
  }

  // Función para calcular el subtotal
  calcularSubtotal(precioNeto: number, cantidad: number, iva: number) {
    return (precioNeto * cantidad) + (precioNeto * cantidad * iva / 100);
  }

  // Función para eliminar un producto del pedido
  eliminarProducto(index: number) {
    this.productosSeleccionados.splice(index, 1);
  }

  // Función para calcular el total del pedido
  calcularTotal() {
    return this.productosSeleccionados.reduce((total, producto) => total + producto.subtotal, 0);
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
}
