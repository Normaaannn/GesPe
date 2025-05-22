import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonItem, IonInput, ToastController } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment.prod';

@Component({
  selector: 'app-recover-password',
  templateUrl: './recover-password.page.html',
  styleUrls: ['./recover-password.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonButton, IonItem, IonInput]
})
export class RecoverPasswordPage implements OnInit {

  constructor(private router: Router, private toastController: ToastController) { }

  ngOnInit() {
  }

  email = '';
  formSubmitted = false;
  emailValid = false;

  isEmailValid(): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(this.email);
  }

  validateEmail() {
    this.emailValid = this.isEmailValid();
  }

  get formInvalid() {
    return !this.emailValid;
  }

  recoverPass(){
    this.formSubmitted = true;

    if (this.formInvalid) {
      return; // No envía si hay campos vacíos
    }

    fetch(environment.apiUrl + '/usuario/forgot-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'text/plain'
      },
      body: JSON.stringify({
        email: this.email
      })
    })
    .then(response => response.text())
    .then(data => {
      if (data.trim() === 'Link de recuperación enviado') {
        this.presentToast('Link de recuperación enviado a tu correo electrónico');
        this.redirigirADespuesDe2Segundos();
      } else {
        this.presentToast(data);
      }
    })
    .catch(error => {
      console.error('Error en la solicitud:', error);
      alert('Error en la solicitud');
    });
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }

  goToReset() {
    this.router.navigate(['/reset-password']);
  }

  redirigirADespuesDe2Segundos() {
    setTimeout(() => {
      this.router.navigate(['/login']);
    }, 2000); // 2000 milisegundos = 2 segundos
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
