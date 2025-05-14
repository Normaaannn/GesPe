import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle } from '@ionic/angular/standalone';
import { IonInput, IonItem, IonList } from '@ionic/angular/standalone';
import { IonButton } from '@ionic/angular/standalone';
import { environment } from 'src/environments/environment.prod';

@Component({
  selector: 'app-info-empresa',
  templateUrl: './info-empresa.page.html',
  styleUrls: ['./info-empresa.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonicModule,
    IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonInput, IonItem, IonList, IonButton]
})
export class InfoEmpresaPage implements OnInit {

  info: any;
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



  public alertButtonsGuardar = [
    {
      text: 'No',
      cssClass: 'alert-button-cancel',
    },
    {
      text: 'Si',
      cssClass: 'alert-button-confirm',
      handler: () => {
        this.addInfo();
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


  constructor(private router : Router) { }

  ngOnInit() {
    // Accede al estado de la navegación para obtener el pedidoId y cliente
    this.loadInfo(); // Cargar la información del cliente al iniciar la página
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

 addInfo() {
    this.formSubmitted = true;

    if (this.formInvalid) {
      return; // No envía si hay campos vacíos
    }

    const token = localStorage.getItem('accessToken');  // Obtener el token desde el localStorage
    if (!token) {
      console.log('No se encontró el token de acceso');
      return;
    }

    const url = environment.apiUrl + `/info_empresa`; // URL de la API para actualizar el cliente

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
      if (data.trim() === 'Información actualizada') {
        alert('Información actualizada');

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
        alert('Error en el registro: ' + data);
      }
    })
    .catch(error => {
      console.error('Error en la solicitud:', error);
      alert('Error en la solicitud');
    });
  }

  loadInfo() {

    const token = localStorage.getItem('accessToken');  // Obtener el token desde el localStorage
    if (!token) {
      console.log('No se encontró el token de acceso');
      return;
    }

    const url = environment.apiUrl + `/info_empresa`; // URL de la API para actualizar el cliente

    fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Error en la solicitud');
      }
      return response.json();  //Convierte la respuesta en formato JSON
    })
    .then(data => {
      console.log("Respuesta completa:", data);

      if (typeof data === "string") {
        data = JSON.parse(data);  //Si la API devuelve texto, lo convierte en JSON
        console.log("Convertido a JSON:", data);
      }

      if (data && typeof data === 'object') {
        console.log("Datos de la API:", data);
        this.info = data;  //Si es un array, lo usa
        this.cargarForm();
      } else {
        console.warn("Formato de datos inesperado:", data);
      }
    })
  }

  cargarForm(){
    if (this.info.id !== undefined) {
      this.clienteID = this.info.id;
      this.nombre = this.info.nombre || '';
      this.apellidos = this.info.apellidos || '';
      this.nif = this.info.nif || '';
      this.email = this.info.email || '';
      this.telefono = this.info.telefono || '';
      this.direccion = this.info.direccion || '';
      this.ciudad = this.info.ciudad || '';
      this.codigoPostal = this.info.codigoPostal || '';
      this.pais = this.info.pais || '';
      this.activo = this.info.activo || null;
      this.fechaRegistro = this.info.fechaRegistro || null;

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

  activarEdicion() {
    this.modoEdicion = true;
  }

  atras() {
    this.router.navigate(['/ajustes']);
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

}
