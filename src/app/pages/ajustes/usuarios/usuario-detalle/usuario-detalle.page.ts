import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonBackButton, IonLabel, IonButton, IonAlert, IonList, IonItem, ToastController } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment.prod';

@Component({
  selector: 'app-usuario-detalle',
  templateUrl: './usuario-detalle.page.html',
  styleUrls: ['./usuario-detalle.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonButtons, IonBackButton, IonLabel, IonButton,
     IonAlert, IonList, IonItem]
})
export class UsuarioDetallePage implements OnInit {

  constructor(private router: Router, private toastController: ToastController) { }

  usuario: any;
  rolUsuario: boolean = false;
  baneado: boolean = false;

  public alertButtonsEliminarUsuario = [
    {
      text: 'No',
      cssClass: 'alert-button-cancel',
    },
    {
      text: 'Si',
      cssClass: 'alert-button-confirm',
      handler: () => {
        this.eliminarUsuario();
      }
    },
  ];

  public alertButtonsDarRolUsuario = [
    {
      text: 'No',
      cssClass: 'alert-button-cancel',
    },
    {
      text: 'Si',
      cssClass: 'alert-button-confirm',
      handler: () => {
        this.darRolUsuario();
      }
    },
  ];

  ngOnInit() {
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state) {
      this.usuario = navigation.extras.state['usuario'];
    }
    this.esUsuario();
    this.esBaneado();
  }

  darRolUsuario() {
    const token = localStorage.getItem('accessToken');  // Obtener el token desde el localStorage
    if (!token) {
      console.log('No se encontró el token de acceso');
      return;
    }

    const url = environment.apiUrl + `/usuario/${this.usuario.id}/darRolUsuario`; // URL de la API para actualizar el cliente

    fetch(url, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      }
    })
    .then(response => response.text())
    .then(data => {
      if (data.trim() === 'Usuario activado correctamente') {
        this.presentToast('Usuario activado');
        this.router.navigate(['/usuarios']);
      } else {
        this.presentToast('Error en el registro: ' + data);
      }
    })
    .catch(error => {
      console.error('Error en la solicitud:', error);
      alert('Error en la solicitud');
    });
  }

  eliminarUsuario() {
    const token = localStorage.getItem('accessToken');  // Obtener el token desde el localStorage
    if (!token) {
      console.log('No se encontró el token de acceso');
      return;
    }

    const url = environment.apiUrl + `/usuario/${this.usuario.id}/banear`; // URL de la API para actualizar el cliente

    fetch(url, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      }
    })
    .then(response => response.text())
    .then(data => {
      if (data.trim() === 'Usuario baneado correctamente') {
        this.presentToast('Usuario baneado');
        this.router.navigate(['/usuarios']);
      } else {
        this.presentToast('Error: ' + data);
      }
    })
    .catch(error => {
      console.error('Error en la solicitud:', error);
      alert('Error en la solicitud');
    });
  }

  esUsuario() {
    if (this.usuario.role === 'ROLE_USER' || this.usuario.role === 'ROLE_ADMIN') {
      this.rolUsuario = true;
    } else {
      this.rolUsuario = false;
    }
  }

  esBaneado() {
    if (this.usuario.role === 'ROLE_BANNED') {
      this.baneado = true;
    } else {
      this.baneado = false;
    }
  }

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      position: 'top',
      cssClass: 'custom-toast'
    });
    toast.present();
  }

  cancelar() {
    this.router.navigate(['/usuarios']);
  }

}
