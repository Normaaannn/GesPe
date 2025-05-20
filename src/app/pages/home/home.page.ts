import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonFooter, IonList, IonItem, IonLabel } from '@ionic/angular/standalone';
import { TabsComponent } from 'src/app/components/tabs/tabs.component';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment.prod';
import { ViewWillEnter } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, TabsComponent, IonFooter, IonList, IonItem, IonLabel]
})
export class HomePage implements ViewWillEnter {

  mesAnioActual: string = '';
  total: number = 0;
  pedidos: any[] = [];
  clientes: any[] = [];
  productos: any[] = [];


  constructor(private router: Router) { }

  ionViewWillEnter() {
    this.mesAnioActual = this.obtenerMesAnioActual();
    this.obtenerTresUltimos();
  }

  obtenerMesAnioActual(): string {
  const fecha = new Date();

  const meses = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  const mes = meses[fecha.getMonth()];
  const anio = fecha.getFullYear();

  return `${mes} ${anio}`;
}

obtenerTresUltimos() {
  const token = localStorage.getItem('accessToken');
  if (!token) {
    console.log('No se encontró el token de acceso');
    return;
  }
  const url = environment.apiUrl + '/misc/datosHome'; // Cambia por tu URL real

  fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    }
  })
    .then(response => {
      if (!response.ok) {
        throw new Error('Error en la solicitud');
      }
      return response.json(); // Convertir la respuesta a JSON
    })
    .then(data => {
      console.log("Respuesta completa:", data);

      // Asignar directamente los datos si existen
      if (data) {
        this.total = data.total || 0;
        this.pedidos = data.pedidos || [];
        this.clientes = data.clientes || [];
        this.productos = data.productos || [];

        console.log("Pedidos:", this.pedidos);
        console.log("Clientes:", this.clientes);
        console.log("Productos:", this.productos);
      } else {
        console.warn("Datos vacíos o inesperados:", data);
      }
    })
    .catch(error => {
      console.error('Error al obtener los datos:', error);
    });
}


}
