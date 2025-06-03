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
  selector: 'app-cliente-detalle',
  templateUrl: './cliente-detalle.page.html',
  styleUrls: ['./cliente-detalle.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonicModule,
    IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonInput, IonItem, IonList, IonButton]
})
export class ClienteDetallePage implements OnInit {

  cliente: any;
  clienteID: number | undefined;
  nombre = '';
  apellidos = '';
  nif = '';
  email = '';
  telefono = '';
  direccion = '';
  ciudad = '';
  codigoPostal = '';
  pais = '';
  activo: boolean | null = null;
  fechaRegistro = null;
  emailValid = true;
  formSubmitted = false;
  modoEdicion: boolean = false;

  nombreForm = '';
  apellidosForm = '';
  nifForm = '';
  emailForm = '';
  telefonoForm = '';
  direccionForm = '';
  ciudadForm = '';
  codigoPostalForm = '';
  paisForm = '';

  public alertButtonsEliminar = this.crearAlertButtons(() => this.eliminarCliente());
  public alertButtonsHabilitar = this.crearAlertButtons(() => this.habilitarCliente());
  public alertButtonsGuardar = this.crearAlertButtons(() => this.updateCliente());
  public alertButtonsCancelar = this.crearAlertButtons(() => this.cancelarEdicion());


  constructor(private router: Router, private toastController: ToastController) { }

  ngOnInit() {
    // Accede al estado de la navegación para obtener el pedidoId y cliente
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state) {
      this.cliente = navigation.extras.state['cliente'];

      this.clienteID = this.cliente.id;
      this.nombre = this.cliente.nombre || '';
      this.apellidos = this.cliente.apellidos || '';
      this.nif = this.cliente.nif || '';
      this.email = this.cliente.email || '';
      this.telefono = this.cliente.telefono || '';
      this.direccion = this.cliente.direccion || '';
      this.ciudad = this.cliente.ciudad || '';
      this.codigoPostal = this.cliente.codigoPostal || '';
      this.pais = this.cliente.pais || '';
      this.activo = this.cliente.activo || null;
      this.fechaRegistro = this.cliente.fechaRegistro || null;

      this.nombreForm = this.nombre;
      this.apellidosForm = this.apellidos;
      this.nifForm = this.nif;
      this.emailForm = this.email;
      this.telefonoForm = this.telefono;
      this.direccionForm = this.direccion;
      this.ciudadForm = this.ciudad;
      this.codigoPostalForm = this.codigoPostal;
      this.paisForm = this.pais;
    }
  }


  isEmailValid(): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(this.emailForm);
  }

  validateEmail() {
    this.emailValid = this.isEmailValid();
  }

  get formInvalid() {
    return !this.nombreForm || !this.apellidosForm || !this.nifForm || !this.emailForm || !this.emailValid || !this.telefonoForm || !this.direccionForm || !this.ciudadForm || !this.codigoPostalForm || !this.paisForm;
  }

  updateCliente() {
    this.formSubmitted = true;

    if (this.formInvalid) {
      return; // No envía si hay campos vacíos
    }

    this.modoEdicion = false;

    const token = localStorage.getItem('accessToken');  // Obtener el token desde el localStorage
    if (!token) {
      console.log('No se encontró el token de acceso');
      return;
    }

    const url = environment.apiUrl + `/cliente/${this.clienteID}`; // URL de la API para actualizar el cliente

    fetch(url, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        nombre: this.nombreForm,
        apellidos: this.apellidosForm,
        email: this.emailForm,
        nif: this.nifForm,
        telefono: this.telefonoForm,
        direccion: this.direccionForm,
        ciudad: this.ciudadForm,
        codigoPostal: this.codigoPostalForm,
        pais: this.paisForm
      })
    })
      .then(response => response.text())
      .then(data => {
        if (data.trim() === 'Cliente actualizado') {
          this.presentToast('Cliente actualizado');

          this.nombre = this.nombreForm;
          this.apellidos = this.apellidosForm;
          this.nif = this.nifForm;
          this.email = this.emailForm;
          this.telefono = this.telefonoForm;
          this.direccion = this.direccionForm;
          this.ciudad = this.ciudadForm;
          this.codigoPostal = this.codigoPostalForm;
          this.pais = this.paisForm;
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
    this.router.navigate(['/clientes']);
  }

  cancelarEdicion() {
    this.modoEdicion = false;

    this.nombreForm = this.nombre;
    this.apellidosForm = this.apellidos;
    this.nifForm = this.nif;
    this.emailForm = this.email;
    this.telefonoForm = this.telefono;
    this.direccionForm = this.direccion;
    this.ciudadForm = this.ciudad;
    this.codigoPostalForm = this.codigoPostal;
    this.paisForm = this.pais;
  }

  eliminarCliente() {
    const token = localStorage.getItem('accessToken');  // Obtener el token desde el localStorage
    if (!token) {
      console.log('No se encontró el token de acceso');
      return;
    }

    const url = environment.apiUrl + `/cliente/${this.clienteID}/desactivar`; // URL de la API para actualizar el cliente

    fetch(url, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      }
    })
      .then(response => response.text())
      .then(data => {
        if (data.trim() === 'Cliente desactivado correctamente') {
          this.presentToast('Cliente eliminado');
          this.router.navigate(['/clientes']);
        } else {
          this.presentToast('Error en el registro: ' + data);
        }
      })
      .catch(error => {
        console.error('Error en la solicitud:', error);
        alert('Error en la solicitud');
      });
  }

  habilitarCliente() {
    const token = localStorage.getItem('accessToken');  // Obtener el token desde el localStorage
    if (!token) {
      console.log('No se encontró el token de acceso');
      return;
    }

    const url = environment.apiUrl + `/cliente/${this.clienteID}/activar`; // URL de la API para actualizar el cliente

    fetch(url, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      }
    })
      .then(response => response.text())
      .then(data => {
        if (data.trim() === 'Cliente activado correctamente') {
          this.presentToast('Cliente habilitado');
          this.router.navigate(['/clientes']);
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
      cssClass: 'toast',
    });

    await toast.present();
  }

  private crearAlertButtons(handler: () => void): any[] {
    return [
      {
        text: 'No',
        cssClass: 'alert-button-cancel',
      },
      {
        text: 'Si',
        cssClass: 'alert-button-confirm',
        handler: handler
      },
    ];
  }
}

