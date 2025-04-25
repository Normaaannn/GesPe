import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonButton, IonTitle, IonToolbar, IonSelect, IonSelectOption, IonItem, IonLabel,
   IonList, IonIcon, IonInput, IonRefresher, IonRefresherContent, IonFooter, IonFab, IonFabButton, IonFabList } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { TabsComponent } from 'src/app/components/tabs/tabs.component';
import { ViewWillEnter } from '@ionic/angular';

import { addIcons } from 'ionicons';
import { add, chevronDownCircle, chevronForwardCircle, chevronUpCircle, colorPalette, document, globe, settingsSharp, ellipsisVertical } from 'ionicons/icons';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonButton,
    IonSelect, IonSelectOption, IonItem, IonLabel, IonList, IonIcon, IonInput, IonRefresher, IonRefresherContent, 
  TabsComponent, IonFooter, IonIcon, IonFab, IonFabButton, IonFabList]
})
export class HomePage implements ViewWillEnter {
  pedidos: any[] = [];
  currentPage: number = 1;
  totalPages: number = 1;
  pageSize: number = 20;  // Definir el tamaño de la página
  pageOptions: number[] = [];

  handleRefresh(event: CustomEvent) {
    setTimeout(() => {
      // Any calls to load data go here
      this.loadPedidos();
      (event.target as HTMLIonRefresherElement).complete();
    }, 2000);
  }

  constructor(private router: Router) { 
    addIcons({ add, chevronDownCircle, chevronForwardCircle, chevronUpCircle, colorPalette, document, globe, settingsSharp, ellipsisVertical });
  }

  ionViewWillEnter() {
    console.log('ionViewWillEnter ejecutado');
    this.loadPedidos();
  }

  loadPedidos() {
    const token = localStorage.getItem('accessToken');  // Obtener el token desde el localStorage
    if (!token) {
      console.log('No se encontró el token de acceso');
      return;
    }

    const url = `http://localhost:8080/pedido/usuarioCreador/${this.currentPage}`;  // URL de la API con paginación
    
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
        return response.json();  // Convierte la respuesta en formato JSON
      })
      .then(data => {
        console.log("Respuesta completa:", data);
    
        if (typeof data === "string") {
            data = JSON.parse(data);  // Si la API devuelve texto, conviértelo a JSON
            console.log("Convertido a JSON:", data);
        }
    
        if (Array.isArray(data)) {  
            this.pedidos = data;  // Si es un array, úsalo directamente
        } else if (data && data.content) {  
            this.pedidos = data.content;  // Si tiene `content`, úsalo
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
}
