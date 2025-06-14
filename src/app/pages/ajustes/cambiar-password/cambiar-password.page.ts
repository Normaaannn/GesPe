import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonItem, IonLabel, IonButton, IonInput, IonBackButton, IonButtons, ToastController } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment.prod';

@Component({
  selector: 'app-cambiar-password',
  templateUrl: './cambiar-password.page.html',
  styleUrls: ['./cambiar-password.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonItem, IonLabel, IonButton, IonInput, IonBackButton, IonButtons]
})
export class CambiarPasswordPage implements OnInit {

  constructor(private router: Router, private toastController: ToastController) { }

  ngOnInit() {
  }

  password = '';
  newPassword = '';
  confirmPassword = '';
  formSubmitted = false;

  get formInvalid() {
    return !this.password || !this.newPassword || !this.confirmPassword;
  }

  cambiarPass() {
    this.formSubmitted = true;

    if (this.formInvalid) {
      return; // No envía si hay campos vacíos
    }

    if (this.newPassword !== this.confirmPassword) {
      alert('Las contraseñas no coinciden');
      return;
    }

    const token = localStorage.getItem('accessToken');  // Obtener el token desde el localStorage
    if (!token) {
      console.log('No se encontró el token de acceso');
      return;
    }

    const url = environment.apiUrl + `/usuario/actualizarPassword`; // URL de la API para actualizar el cliente

    fetch(url, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        password: this.password,
        newPassword: this.newPassword
      })
    })
      .then(response => response.text())
      .then(data => {
        if (data.trim() === 'Contraseña actualizada') {
          this.presentToast('Contraseña actualizada');
          this.router.navigate(['/ajustes']); // Redirigir a la página de ajustes
        } else {
          this.presentToast('Error: ' + data);
        }
      })
      .catch(error => {
        console.error('Error en la solicitud:', error);
        alert('Error en la solicitud');
      });
  }

  cancelar() {
    this.router.navigate(['/ajustes']);
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
