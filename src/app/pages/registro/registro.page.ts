import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle } from '@ionic/angular/standalone';
import { IonInput, IonItem, IonList } from '@ionic/angular/standalone';
import { IonButton } from '@ionic/angular/standalone';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonicModule,
    IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonInput, IonItem, IonList, IonButton]
})
export class RegistroPage implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
    console.log('RegisterPage cargada');
  }

  username = '';
  email = '';
  password = '';
  confirmPassword = '';
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
    return !this.username || !this.email || !this.password || !this.confirmPassword || !this.emailValid;
  }

  register() {
    this.formSubmitted = true;

    if (this.formInvalid) {
      return; // No envía si hay campos vacíos
    }

    if (this.password !== this.confirmPassword) {
      alert('Las contraseñas no coinciden');
      return;
    }

    console.log(this.password);

    fetch('http://localhost:8080/usuario/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'text/plain'
      },
      body: JSON.stringify({
        username: this.username,
        email: this.email,
        passwordHash: this.password
      })
    })
    .then(response => response.text())
    .then(data => {
      if (data.trim() === 'Registro completado') {
        alert('Registro exitoso');
        this.router.navigate(['/login']);
      } else {
        alert('Error en el registro: ' + data);
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


}
