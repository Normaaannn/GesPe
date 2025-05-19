import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonButton, IonTitle, IonToolbar, IonSelect, IonSelectOption, IonItem, IonLabel,
  IonList, IonIcon, IonInput, IonRefresher, IonRefresherContent, IonFooter, IonFab, IonFabButton, IonSearchbar,
IonSegment, IonSegmentButton, IonButtons, IonBackButton } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { TabsComponent } from 'src/app/components/tabs/tabs.component';
import { ViewWillEnter } from '@ionic/angular';
import { environment } from 'src/environments/environment.prod';

import { addIcons } from 'ionicons';
import { add } from 'ionicons/icons';


@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.page.html',
  styleUrls: ['./usuarios.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonButton,
    IonSelect, IonSelectOption, IonItem, IonLabel, IonList, IonIcon, IonInput, IonRefresher, IonRefresherContent, 
  TabsComponent, IonFooter, IonFab, IonFabButton, IonSearchbar, IonSegment, IonSegmentButton, IonButtons, IonBackButton]
})
export class UsuariosPage implements ViewWillEnter {

  usuarios: any[] = [];
  searchTerm: string = '';  // Variable para almacenar el término de búsqueda
  currentPage: number = 1;
  totalPages: number = 1;
  pageSize: number = 20;  // Definir el tamaño de la página
  pageOptions: number[] = [];
  segmentButton: number = 1; // Variable para almacenar el botón actual del segmento

  handleRefresh(event: CustomEvent) {
    setTimeout(() => {
      // Any calls to load data go here
      this.loadUsuarios(this.segmentButton);
      (event.target as HTMLIonRefresherElement).complete();
    }, 2000);
  }

  constructor(private router: Router) { 
    addIcons({ add });
  }

  ionViewWillEnter() {
    this.loadUsuarios();
  }

  loadUsuarios(botonSegment: number = this.segmentButton) {
    this.segmentButton = botonSegment;  // Actualizar el botón del segmento
    const token = localStorage.getItem('accessToken');  // Obtener el token desde el localStorage
    if (!token) {
      console.log('No se encontró el token de acceso');
      return;
    }

    let url = '';
  if (this.searchTerm.trim() === '') {
    // Si searchType es 1, usamos la URL para cargar todos los pedidos
    switch (botonSegment) {
      case 1:
        url = environment.apiUrl + `/usuario/user/page/${this.currentPage}`; // URL para cargar todos los pedidos activos
        break;
      case 2:
        url = environment.apiUrl + `/usuario/guest/page/${this.currentPage}`; // URL para cargar todos los pedidos inactivos
        break;
      case 3:
        url = environment.apiUrl + `/usuario/page/${this.currentPage}`; // URL para cargar todos los pedidos bloqueados
        break;
    }
  } else {
    // Si searchType es 2, usamos la URL para cargar pedidos según el searchbar
    switch (botonSegment) {
      case 1:
        url = environment.apiUrl + `/usuario/buscar/user/${this.searchTerm}/page/${this.currentPage}`; // URL para cargar todos los pedidos activos
        break;
      case 2:
        url = environment.apiUrl + `/usuario/buscar/guest/${this.searchTerm}/page/${this.currentPage}`; // URL para cargar todos los pedidos inactivos
        break;
      case 3:
        url = environment.apiUrl + `/usuario/buscar/${this.searchTerm}/page/${this.currentPage}`; // URL para cargar todos los pedidos bloqueados
        break;
    }
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
            this.usuarios = data;  // Si es un array, úsalo directamente
        } else if (data && data.content) {  
            this.usuarios = data.content;  // Si tiene `content`, úsalo
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
    this.loadUsuarios();  // Cargar los pedidos para la página actual
  }


  // Navegar a la página anterior
  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadUsuarios();
    }
  }

  // Navegar a la página siguiente
  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.loadUsuarios();
    }
  }

  goToUsuarioDetalle(usuario: any) {
    this.router.navigate(['/usuario-detalle'], {
      state: { 
        usuario: usuario,
      }
    });
  }

}
