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
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonicModule,
    IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonInput, IonItem, IonList, IonButton]
})
export class LoginPage implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
    console.log('LoginPage cargada');
  }

  username: string = '';
  password: string = '';

  login() {
    fetch('http://localhost:8080/auth/login', {
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
        // Guardar los tokens en el localStorage o sessionStorage
        localStorage.setItem('accessToken', data.accessToken);
        localStorage.setItem('refreshToken', data.refreshToken);
        localStorage.setItem('role', data.role); // Guardar el rol del usuario
        console.log('Login exitoso');
        // Redirigir o hacer algo más después del login exitoso
        this.router.navigate(['/home']);
      } else {
        console.log('Login fallido');
        alert('Credenciales incorrectas');
      }
    })
    .catch(error => {
      console.error('Error en la solicitud:', error);
    });
  }

  goToRegistro() {
    this.router.navigate(['/registro']);
  }

}
