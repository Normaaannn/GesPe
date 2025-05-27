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
  selector: 'app-cliente-add',
  templateUrl: './cliente-add.page.html',
  styleUrls: ['./cliente-add.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonicModule,
    IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonInput, IonItem, IonList, IonButton]
})
export class ClienteAddPage implements OnInit {


  constructor(private router: Router, private toastController: ToastController) {
   }

  ngOnInit() {
  }

  nombre = '';
  apellidos = '';
  nif = '';
  email = '';
  telefono = '';
  direccion = '';
  ciudad = '';
  codigoPostal = '';
  pais = '';
  emailValid = false;
  formSubmitted = false;

  isEmailValid(): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(this.email);
  }

  validateEmail() {
    this.emailValid = this.isEmailValid();
  }

  get formInvalid() {
    return !this.nombre || !this.apellidos || !this.nif || !this.email || !this.emailValid || !this.telefono || !this.direccion || !this.ciudad || !this.codigoPostal || !this.pais;
  }

  addCliente() {
    this.formSubmitted = true;

    if (this.formInvalid) {
      return; // No envía si hay campos vacíos
    }

    const token = localStorage.getItem('accessToken');  // Obtener el token desde el localStorage
    if (!token) {
      console.log('No se encontró el token de acceso');
      return;
    }

    fetch(environment.apiUrl + '/cliente', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        nombre: this.nombre,
        apellidos: this.apellidos,
        email: this.email,
        nif: this.nif,
        telefono: this.telefono,
        direccion: this.direccion,
        ciudad: this.ciudad,
        codigoPostal: this.codigoPostal,
        pais: this.pais      
      })
    })
    .then(response => response.text())
    .then(data => {
      if (data.trim() === 'Cliente añadido') {
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

  cancelar() {
    this.router.navigate(['/clientes']);
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
}
