import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, ToastController } from '@ionic/angular/standalone';
import { IonInput, IonItem, IonList } from '@ionic/angular/standalone';
import { IonButton } from '@ionic/angular/standalone';
import { environment } from 'src/environments/environment.prod';

@Component({
  selector: 'app-producto-detalle',
  templateUrl: './producto-detalle.page.html',
  styleUrls: ['./producto-detalle.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonicModule,
    IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonInput, IonItem, IonList, IonButton]
})
export class ProductoDetallePage implements OnInit {

  producto: any;
  productoID: number | undefined;
  nombre = '';
  descripcion = '';
  precioNeto = '';
  iva = '';
  precioBruto = '';
  activo: boolean | null = null;
  fechaRegistro = null;
  formSubmitted = false;
  modoEdicion: boolean = false;

  nombreForm = '';
  descripcionForm = '';
  precioNetoForm = '';
  ivaForm = '';

  public alertButtonsEliminar = [
    {
      text: 'No',
      cssClass: 'alert-button-cancel',
    },
    {
      text: 'Si',
      cssClass: 'alert-button-confirm',
      handler: () => {
        this.eliminarProducto();
      }
    },
  ];

  public alertButtonsHabilitar = [
    {
      text: 'No',
      cssClass: 'alert-button-cancel',
    },
    {
      text: 'Si',
      cssClass: 'alert-button-confirm',
      handler: () => {
        this.habilitarProducto();
      }
    },
  ];

  public alertButtonsGuardar = [
    {
      text: 'No',
      cssClass: 'alert-button-cancel',
    },
    {
      text: 'Si',
      cssClass: 'alert-button-confirm',
      handler: () => {
        this.updateProducto();
      }
    },
  ];

  public alertButtonsCancelar = [
    {
      text: 'No',
      cssClass: 'alert-button-cancel',
    },
    {
      text: 'Si',
      cssClass: 'alert-button-confirm',
      handler: () => {
        this.cancelarEdicion();
      }
    },
  ];


  constructor(private router : Router, private toastController: ToastController) { }

  ngOnInit() {
    // Accede al estado de la navegación para obtener el pedidoId y cliente
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state) {
      this.producto = navigation.extras.state['producto'];

      this.productoID = this.producto.id;
      this.nombre = this.producto.nombre || '';
      this.descripcion = this.producto.descripcion || '';
      this.precioNeto = this.producto.precioNeto || '';
      this.iva = this.producto.iva || '';    
      this.activo = this.producto.activo || null;
      this.fechaRegistro = this.producto.fechaRegistro || null;

      this.calcularPrecioBruto();

      this.nombreForm = this.nombre;
      this.descripcionForm = this.descripcion;
      this.precioNetoForm = this.precioNeto;
      this.ivaForm = this.iva;      
    }
  }



  get formInvalid() {
    return !this.nombreForm || !this.descripcionForm || !this.precioNetoForm || !this.ivaForm;
  }

  calcularPrecioBruto() {
    this.precioBruto = (parseFloat(this.precioNeto) * (1 + parseFloat(this.iva) / 100)).toString();
  }

  updateProducto() {
    this.formSubmitted = true;

    if (this.formInvalid) {
      return; // No envía si hay campos vacíos
    }

    const token = localStorage.getItem('accessToken');  // Obtener el token desde el localStorage
    if (!token) {
      console.log('No se encontró el token de acceso');
      return;
    }

    const url = environment.apiUrl + `/producto/${this.productoID}`; // URL de la API para actualizar el cliente

    fetch(url, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        nombre: this.nombreForm,
        descripcion: this.descripcionForm,
        precioNeto: this.precioNetoForm,
        iva: this.ivaForm,
      })
    })
    .then(response => response.text())
    .then(data => {
      if (data.trim() === 'Producto actualizado') {
        this.presentToast('Producto actualizado');
        this.nombre = this.nombreForm;
        this.descripcion = this.descripcionForm;
        this.precioNeto = this.precioNetoForm;
        this.iva = this.ivaForm;
        this.modoEdicion = false;
      } else {
        this.presentToast('Error en el registro: ' + data);
      }
    })
    .catch(error => {
      console.error('Error en la solicitud:', error);
      alert('Error en la solicitud');
    });
  }

  activarEdicion() {
    this.modoEdicion = true;
  }

  atras() {
    this.router.navigate(['/productos']);
  }

  cancelarEdicion() {
    this.modoEdicion = false;

    this.nombreForm = this.nombre;
    this.descripcionForm = this.descripcion;
    this.precioNetoForm = this.precioNeto;
    this.ivaForm = this.iva;
  }

  eliminarProducto() {
    const token = localStorage.getItem('accessToken');  // Obtener el token desde el localStorage
    if (!token) {
      console.log('No se encontró el token de acceso');
      return;
    }

    const url = environment.apiUrl + `/producto/${this.productoID}/desactivar`; // URL de la API para actualizar el cliente

    fetch(url, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      }
    })
    .then(response => response.text())
    .then(data => {
      if (data.trim() === 'Producto desactivado correctamente') {
        this.presentToast('Producto eliminado');
        this.router.navigate(['/productos']);
      } else {
        this.presentToast('Error en el registro: ' + data);
      }
    })
    .catch(error => {
      console.error('Error en la solicitud:', error);
      alert('Error en la solicitud');
    });
  }

  habilitarProducto() {
    const token = localStorage.getItem('accessToken');  // Obtener el token desde el localStorage
    if (!token) {
      console.log('No se encontró el token de acceso');
      return;
    }

    const url = environment.apiUrl + `/producto/${this.productoID}/activar`; // URL de la API para actualizar el cliente

    fetch(url, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      }
    })
    .then(response => response.text())
    .then(data => {
      if (data.trim() === 'Producto activado correctamente') {
        this.presentToast('Producto habilitado');
        this.router.navigate(['/productos']);
      } else {
        this.presentToast('Error en el registro: ' + data);
      }
    })
    .catch(error => {
      console.error('Error en la solicitud:', error);
      alert('Error en la solicitud');
    });
  }

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      position: 'top',
    });

    await toast.present();
  }

}
