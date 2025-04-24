import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonButton, IonTitle, IonToolbar, IonSelect, IonSelectOption, IonItem, IonLabel,
  IonList, IonIcon, IonInput, IonRefresher, IonRefresherContent, IonFooter, IonFab, IonFabButton, IonSearchbar } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { TabsComponent } from 'src/app/components/tabs/tabs.component';
import { ViewWillEnter } from '@ionic/angular';

import { addIcons } from 'ionicons';
import { add } from 'ionicons/icons';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.page.html',
  styleUrls: ['./clientes.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonButton,
    IonSelect, IonSelectOption, IonItem, IonLabel, IonList, IonIcon, IonInput, IonRefresher, IonRefresherContent, 
  TabsComponent, IonFooter, IonFab, IonFabButton, IonSearchbar]
})
export class ClientesPage implements ViewWillEnter {
  clientes: any[] = [];
  searchTerm: string = '';  // Variable para almacenar el término de búsqueda
  currentPage: number = 1;
  totalPages: number = 1;
  pageSize: number = 20;  // Definir el tamaño de la página
  pageOptions: number[] = [];

  handleRefresh(event: CustomEvent) {
    setTimeout(() => {
      // Any calls to load data go here
      this.loadClientes();
      (event.target as HTMLIonRefresherElement).complete();
    }, 2000);
  }

  constructor(private router: Router) { 
    addIcons({ add });
  }

  ionViewWillEnter() {
    console.log('ionViewWillEnter ejecutado');
    this.loadClientes();
  }

  loadClientes(searchType: number = 1) {
    const token = localStorage.getItem('accessToken');  // Obtener el token desde el localStorage
    if (!token) {
      console.log('No se encontró el token de acceso');
      return;
    }

    let url = '';
  if (searchType === 1) {
    // Si searchType es 1, usamos la URL para cargar todos los pedidos
    url = `http://localhost:8080/cliente/page/${this.currentPage}`;
  } else if (searchType === 2) {
    // Si searchType es 2, usamos la URL para cargar pedidos según el searchbar
    url = `http://localhost:8080/cliente/buscar/${this.searchTerm}/${this.currentPage}`; // Asegúrate de que esta URL sea la correcta
  }
    
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
            this.clientes = data;  // Si es un array, úsalo directamente
        } else if (data && data.content) {  
            this.clientes = data.content;  // Si tiene `content`, úsalo
            this.totalPages = data.totalPages || 1;
            this.pageOptions = Array.from({ length: this.totalPages }, (_, i) => i + 1);
        } else {
            console.warn("Formato de datos inesperado:", data);
        }
    })
  }

  onSearchInput() {
    if (this.searchTerm.trim() === '') {
      // Si el searchbar está vacío, llamar con searchType 1
      this.loadClientes(1);
    } else {
      // Si hay texto en el searchbar, llamar con searchType 2
      this.loadClientes(2);
    }
  }

  changePage(direction: string) {
    if (direction === 'prev' && this.currentPage > 1) {
      this.currentPage--;
    } else if (direction === 'next' && this.currentPage < this.totalPages) {
      this.currentPage++;
    }
    this.loadClientes();  // Cargar los pedidos para la página actual
  }


  // Navegar a la página anterior
  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadClientes();
    }
  }

  // Navegar a la página siguiente
  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.loadClientes();
    }
  }

  goToClienteDetalle(cliente: any) {
    this.router.navigate(['/cliente-detalle'], {
      state: { 
        cliente: cliente,
      }
    });
  }

  goToAddCliente() {
    this.router.navigate(['/cliente-add']);
  }
}
