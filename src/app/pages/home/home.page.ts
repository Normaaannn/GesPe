import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent, IonHeader, IonButton, IonTitle, IonToolbar, IonSelect, IonSelectOption, IonItem, IonLabel,
  IonList, IonIcon, IonInput, IonRefresher, IonRefresherContent, IonFooter, IonFab, IonFabButton, IonFabList, IonDatetime,
  IonDatetimeButton, IonModal, IonRow, IonCol
} from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { TabsComponent } from 'src/app/components/tabs/tabs.component';
import { ViewWillEnter } from '@ionic/angular';

import { addIcons } from 'ionicons';
import { add, chevronDownCircle, chevronForwardCircle, chevronUpCircle, colorPalette, document, globe, settingsSharp, ellipsisVertical, logOutOutline } from 'ionicons/icons';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonButton,
    IonSelect, IonSelectOption, IonItem, IonLabel, IonList, IonIcon, IonInput, IonRefresher, IonRefresherContent,
    TabsComponent, IonFooter, IonIcon, IonFab, IonFabButton, IonFabList, IonDatetime, IonDatetimeButton, IonModal,
    IonRow, IonCol]
})
export class HomePage implements OnInit {
  pedidos: any[] = [];
  currentPage: number = 1;
  totalPages: number = 1;
  pageSize: number = 20;  // Definir el tamaño de la página
  pageOptions: number[] = [];
  dataLoaded: boolean = false;
  fechaInicio: string = new Date().toISOString();
  fechaFin: string = new Date().toISOString();

  handleRefresh(event: CustomEvent) {
    setTimeout(() => {
      // Any calls to load data go here
      this.loadPedidos();
      (event.target as HTMLIonRefresherElement).complete();
    }, 2000);
  }

  constructor(private router: Router) {
    addIcons({ add, chevronDownCircle, chevronForwardCircle, chevronUpCircle, colorPalette, document, globe, settingsSharp, ellipsisVertical, logOutOutline });
  }

  ngOnInit() {
    if (!this.dataLoaded) {
      console.log('Datos cargados');
      this.loadPedidos();
      this.dataLoaded = true;  // Marcar como cargado para evitar recargas innecesarias
    }
    this.fechaFin = this.getFechaInicioMasUnMes();
  }

  loadPedidos() {
    const token = localStorage.getItem('accessToken');  //Obtener el token desde el localStorage
    if (!token) {
      console.log('No se encontró el token de acceso');
      return;
    }

    let month1 = new Date(this.fechaInicio).getMonth() + 1;  // Obtener el mes de la fecha de inicio (1-12)
    let year1 = new Date(this.fechaInicio).getFullYear();  // Obtener el año de la fecha de inicio (YYYY)   
    let month2 = new Date(this.fechaFin).getMonth() + 1;  // Obtener el mes de la fecha de fin (1-12)
    let year2 = new Date(this.fechaFin).getFullYear();  // Obtener el año de la fecha de fin (YYYY)

    const url = `http://localhost:8080/pedido/buscar?&year1=${year1}&month1=${month1}&year2=${year2}&month2=${month2}&page=${this.currentPage}`;

    fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Error en la solicitud');
        }
        return response.json();  //Convierte la respuesta en formato JSON
      })
      .then(data => {
        console.log("Respuesta completa:", data);

        if (typeof data === "string") {
          data = JSON.parse(data);  //Si la API devuelve texto, lo convierte en JSON
          console.log("Convertido a JSON:", data);
        }

        if (Array.isArray(data)) {
          this.pedidos = data;  //Si es un array, lo usa
        } else if (data && data.content) {
          this.pedidos = data.content;  // Si tiene content, lo usa
          this.totalPages = data.totalPages || 1;
          this.pageOptions = Array.from({ length: this.totalPages }, (_, i) => i + 1);
        } else {
          console.warn("Formato de datos inesperado:", data);
        }
      })
  }

  changePage(direction: string) {
    if (direction === 'prev' && this.currentPage > 1) {
      this.currentPage--;
    } else if (direction === 'next' && this.currentPage < this.totalPages) {
      this.currentPage++;
    }
    this.loadPedidos();  // Cargar los pedidos para la página actual
  }


  // Navegar a la página anterior
  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadPedidos();
    }
  }

  // Navegar a la página siguiente
  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.loadPedidos();
    }
  }

  goToPedidoDetalle(pedido: any) {
    this.router.navigate(['/pedido-detalle'], {
      state: {
        pedidoId: pedido.id,  // El id del pedido
        cliente: pedido.cliente  // El objeto completo cliente
      }
    });
  }

  goToAddPedido() {
    this.router.navigate(['/pedido-add']);
  }

  goToAjustes() {
    this.router.navigate(['/ajustes']);
  }

  logOut() {
    localStorage.removeItem('accessToken');  // Eliminar el token del localStorage
    localStorage.removeItem('refreshToken');  // Eliminar el refresh token del localStorage
    localStorage.removeItem('role');  // Eliminar el rol del localStorage
    this.router.navigate(['/login']);  // Redirigir a la página de login
  }

  getFechaInicioMasUnMes(){
    const fechaInicio = new Date(this.fechaInicio);  // Crear un objeto Date a partir de la cadena de fecha
    fechaInicio.setMonth(fechaInicio.getMonth() + 1);  // Sumar un mes a la fecha
    return fechaInicio.toISOString();  // Devolver la fecha en formato YYYY-MM-DD
  }
}
