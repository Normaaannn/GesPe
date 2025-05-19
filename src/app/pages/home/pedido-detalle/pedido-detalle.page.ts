import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonAccordion, IonAccordionGroup, IonItem, IonLabel, IonButton,
   IonButtons, IonBackButton, IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonFooter } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment.prod';

@Component({
  selector: 'app-pedido-detalle',
  templateUrl: './pedido-detalle.page.html',
  styleUrls: ['./pedido-detalle.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule,
     IonAccordion, IonAccordionGroup, IonItem, IonLabel, IonButton, IonButtons, IonBackButton,
     IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonFooter]
})
export class PedidoDetallePage implements OnInit {

  pedidoId: number | undefined;
  pedidoFecha: string | undefined;
  cliente: any;
  detalles: any;

  constructor(private router : Router) { }

  ngOnInit() {
    // Accede al estado de la navegación para obtener el pedidoId y cliente
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state) {
      this.pedidoId = navigation.extras.state['pedidoId'];
      this.pedidoFecha = navigation.extras.state['pedidoFecha'];
      this.cliente = navigation.extras.state['cliente'];
      this.loadDetalles();  // Llama a la función para cargar los detalles del pedido
    }    
  }

  loadDetalles() {
    const token = localStorage.getItem('accessToken');  // Obtener el token desde el localStorage
    if (!token) {
      console.log('No se encontró el token de acceso');
      return;
    }

    const url = environment.apiUrl + `/pedidos/${this.pedidoId}/detalles`;  // URL de la API con paginación
    
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
            this.detalles = data;  // Si es un array, úsalo directamente
        } else if (data && data.content) {  
            this.detalles = data.content;  // Si tiene `content`, úsalo
        } else {
            console.warn("Formato de datos inesperado:", data);
        }
    })
  }

  generarPDF() {
    const token = localStorage.getItem('accessToken');  // Obtener el token desde el localStorage
    if (!token) {
      console.log('No se encontró el token de acceso');
      return;
    }

    const url = environment.apiUrl + `/pedido/factura/${this.pedidoId}/pdf`;  // URL de la API para generar PDF
    
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
        return response.blob();  // Convierte la respuesta en un blob
      })
      .then(blob => {
        const url = window.URL.createObjectURL(blob);  // Crea un objeto URL para el blob
        const a = document.createElement('a');  // Crea un elemento <a> para descargar el archivo
        a.href = url;
        a.download = `pedido_${this.pedidoId}.pdf`;  // Nombre del archivo PDF
        document.body.appendChild(a);  // Añade el elemento al DOM
        a.click();  // Simula un clic para descargar el archivo
        a.remove();  // Elimina el elemento del DOM
      })
      .catch(error => {
        console.error('Error al generar el PDF:', error);
      });
  }
}
