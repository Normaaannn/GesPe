import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonItem, IonLabel, IonButton, IonInput, IonBackButton, IonButtons } from '@ionic/angular/standalone';

@Component({
  selector: 'app-cambiar-password',
  templateUrl: './cambiar-password.page.html',
  styleUrls: ['./cambiar-password.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonItem, IonLabel, IonButton, IonInput, IonBackButton, IonButtons]
})
export class CambiarPasswordPage implements OnInit {

  constructor() { }

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

    if (this.password !== this.confirmPassword) {
      alert('Las contraseñas no coinciden');
      return;
    }
  }

}
