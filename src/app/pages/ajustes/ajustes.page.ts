import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButtons, IonBackButton, IonItem, IonLabel } from '@ionic/angular/standalone';
import { Router } from '@angular/router'; 


@Component({
  selector: 'app-ajustes',
  templateUrl: './ajustes.page.html',
  styleUrls: ['./ajustes.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonButtons, IonBackButton, IonItem, IonLabel]
})
export class AjustesPage implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }

  goToCambiarPass() {
    this.router.navigate(['/cambiar-password']);  
  }

  goToCambiarInfoEmpresa() { 
  }

  goToVerUsuarios() {   
    this.router.navigate(['/usuarios']);   
  }

  comprobarRol() {
    const rol = localStorage.getItem('role');  // Obtener el rol desde el localStorage
    if (rol === 'ROLE_ADMIN') {
      return true;  // El usuario tiene el rol de admin
    } else {
      return false;  // El usuario no tiene el rol de admin
    }
  }

}
