import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, ToastController } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonCheckbox } from '@ionic/angular/standalone';
import { IonInput, IonItem, IonList } from '@ionic/angular/standalone';
import { IonButton } from '@ionic/angular/standalone';
import { environment } from 'src/environments/environment.prod';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonicModule,
    IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonInput, IonItem, IonList, IonButton, IonCheckbox]
})
export class LoginPage implements OnInit {

  constructor(private router: Router, private toastController: ToastController) { }

  ngOnInit() {
    console.log('LoginPage cargada');
  }

  username: string = '';
  password: string = '';
  mantenerConectado: boolean = false;

  login() {
    fetch(environment.apiUrl + '/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        username: this.username,
        password: this.password
      })
    })
    .then(response => response.json())
    .then(data => {
      if (data.accessToken && data.refreshToken && data.role) {
        //Guardar los tokens en el localStorage o sessionStorage
        localStorage.setItem('accessToken', data.accessToken);
        //Si se mantiene conectado, guardar el refreshToken
        if(this.mantenerConectado){
          localStorage.setItem('refreshToken', data.refreshToken);
        }
        localStorage.setItem('role', data.role); //Guardar el rol del usuario
        console.log('Login exitoso');
        //Redirige al home
        this.obtenerAvatar().then(() => {
          console.log('Avatar obtenido');
          this.presentToast('Sesión iniciada');
          this.router.navigate(['/home']);
        });     
      } else {
        console.log('Login fallido');
        this.presentToast('Credenciales incorrectas');
      }
    })
    .catch(error => {
      console.error('Error en la solicitud:', error);
    });
  }

  goToRegistro() {
    this.router.navigate(['/registro']);
  }

  goToRecuperarPass() {
    this.router.navigate(['/recover-password']);
  }

  async obtenerAvatar(): Promise<void> {
    const token = localStorage.getItem('accessToken');  // Obtener el token desde el localStorage
    if (!token) {
      console.log('No se encontró el token de acceso');
      return;
    }

    const url = environment.apiUrl + `/usuario/obtenerAvatar`; // URL de la API para obtener el cliente

    return fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      }
    })
      .then(response => response.text())
      .then(avatarUrl => {
        console.log("Respuesta completa:", avatarUrl);
        if (avatarUrl) {
          localStorage.setItem('avatarUrl', avatarUrl);
        } else {
          console.log('No se encontró el avatar');
          localStorage.setItem('avatarUrl', 'https://ionicframework.com/docs/img/demos/avatar.svg'); // URL por defecto
        }
      })
      .catch(error => {
        console.error('Error en la solicitud:', error);
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
