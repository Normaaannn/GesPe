import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonBackButton, IonLabel, IonButton, IonAlert } from '@ionic/angular/standalone';
import { Router } from '@angular/router';

@Component({
  selector: 'app-usuario-detalle',
  templateUrl: './usuario-detalle.page.html',
  styleUrls: ['./usuario-detalle.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonButtons, IonBackButton, IonLabel, IonButton, IonAlert]
})
export class UsuarioDetallePage implements OnInit {

  constructor(private router: Router) { }

  usuario: any;
  rolUsuario: boolean = false;

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
      this.esUsuario();
    }
  }

  darRolUsuario() {
  }

  eliminarUsuario() {
  }

  esUsuario() {
    if (this.usuario.role === 'ROLE_USER') {
      this.rolUsuario = true;
    } else {
      this.rolUsuario = false;
    }
  }


}
