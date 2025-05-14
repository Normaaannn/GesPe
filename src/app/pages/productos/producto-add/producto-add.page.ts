import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle } from '@ionic/angular/standalone';
import { IonInput, IonItem, IonList } from '@ionic/angular/standalone';
import { IonButton } from '@ionic/angular/standalone';
import { environment } from 'src/environments/environment.prod';

@Component({
  selector: 'app-producto-add',
  templateUrl: './producto-add.page.html',
  styleUrls: ['./producto-add.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonicModule,
    IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonInput, IonItem, IonList, IonButton]
})
export class ProductoAddPage implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }

  nombre = '';
  descripcion = '';
  precioNeto = '';
  iva = '';
  precioBruto = '';
  formSubmitted = false;

  get formInvalid() {
    return !this.nombre || !this.descripcion || !this.precioNeto || !this.iva;
  }

  addProducto() {
    this.formSubmitted = true;

    if (this.formInvalid) {
      return; // No envía si hay campos vacíos
    }

    const token = localStorage.getItem('accessToken');  // Obtener el token desde el localStorage
    if (!token) {
      console.log('No se encontró el token de acceso');
      return;
    }

    const url = environment.apiUrl + `/producto`; // URL de la API para actualizar el cliente

    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        nombre: this.nombre,
        descripcion: this.descripcion,
        precioNeto: this.precioNeto,
        iva: this.iva,
      })
    })
    .then(response => response.text())
    .then(data => {
      if (data.trim() === 'Producto añadido') {
        alert('Producto añadido');
        this.router.navigate(['/productos']);
      } else {
        alert('Error en el registro: ' + data);
      }
    })
    .catch(error => {
      console.error('Error en la solicitud:', error);
      alert('Error en la solicitud');
    });
  }

  cancelar() {
    this.router.navigate(['/productos']);
  }
}
