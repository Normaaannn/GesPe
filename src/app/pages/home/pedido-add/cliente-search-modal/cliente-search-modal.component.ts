import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonSearchbar, IonList, IonItem, IonLabel, IonButton, IonHeader, IonToolbar, IonButtons, IonTitle, IonContent, ModalController, IonSelectOption } from '@ionic/angular/standalone';
import { TabsComponent } from 'src/app/components/tabs/tabs.component';

@Component({
  selector: 'app-cliente-search-modal',
  templateUrl: './cliente-search-modal.component.html',
  styleUrls: ['./cliente-search-modal.component.scss'],
  imports: [IonSearchbar, IonList, IonItem, IonLabel, IonButton, IonHeader, IonToolbar, IonButtons, IonTitle, IonContent, FormsModule, IonSelectOption, CommonModule, TabsComponent]
})
export class ClienteSearchModalComponent  implements OnInit {

  clientes: any[] = [];
  searchTerm: string = '';  // Variable para almacenar el término de búsqueda
  currentPage: number = 1;
  totalPages: number = 1;
  pageSize: number = 20;  // Definir el tamaño de la página
  pageOptions: number[] = [];

  constructor(private modalController: ModalController) {}

  ngOnInit(): void {
    this.loadClientes();  // Cargar productos al iniciar el componente

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

  // Función para seleccionar un producto y cerrarlo
  seleccionarCliente(cliente: any) {
    this.modalController.dismiss({ cliente });
  }

  // Función para cerrar el modal sin seleccionar producto
  cancelar() {
    this.modalController.dismiss();
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

}
