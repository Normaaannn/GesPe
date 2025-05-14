import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonItem, IonInput, IonButton } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.page.html',
  styleUrls: ['./reset-password.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonButton, IonItem, IonInput]
})
export class ResetPasswordPage implements OnInit {

  newPassword = '';
  confirmPassword = '';
  formSubmitted = false;
  token: string | null = null;

  constructor(private router: Router, private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.activatedRoute.queryParamMap.subscribe(params => {
      this.token = params.get('token');
      console.log('Token recibido:', this.token);
    });
  }


  get formInvalid() {
    return !this.newPassword || !this.confirmPassword;
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


    const url = `http://localhost:8080/usuario/reset-password`; // URL de la API para actualizar el cliente

    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'text/plain'
      },
      body: JSON.stringify({
        token: this.token,
        newPassword: this.newPassword
      })
    })
      .then(response => response.text())
      .then(data => {
        if (data.trim() === 'Contraseña actualizada') {
          alert('Contraseña actualizada');
          this.router.navigate(['/login']); // Redirigir a la página de ajustes
        } else {
          alert('Error en el registro: ' + data);
        }
      })
      .catch(error => {
        console.error('Error en la solicitud:', error);
        alert('Error en la solicitud');
      });
  }

}
