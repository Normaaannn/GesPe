import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, ToastController } from '@ionic/angular/standalone';
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

  constructor(private router: Router, private toastController: ToastController) { }

  ngOnInit() {
  }

  nombre = '';
  descripcion = '';
  precioNeto = '';
  iva = '';
  precioBruto = 0;
  formSubmitted = false;

  get formInvalid() {
    return !this.nombre || !this.descripcion || !this.precioNeto || !this.iva;
  }

  addProducto() {
    this.formSubmitted = true;

    if (this.formInvalid) {
      return; // No envía si hay campos vacíos
    }

    if (Number(this.precioNeto) < 0 || Number(this.precioNeto) > 9999999999 || Number(this.iva) < 0 || Number(this.iva) > 99) {
      this.presentToast('Los valores de precio neto o IVA son negativos o muy grandes.');
      return; // No envía si los valores son inválidos
    }

    if(this.tieneDecimales(this.precioNeto, 2)) {
      this.presentToast('El precio neto no puede tener mas de dos decimales.');
      return; // No envía si los valores tienen demasiados decimales
    }

    if(this.tieneDecimales(this.iva, 0)) {
      this.presentToast('El iva no puede tener decimales.');
      return; // No envía si los valores tienen demasiados decimales
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
          this.router.navigate(['/productos']);
        } else {
          this.presentToast('Error en el registro: ' + data);
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

  actualizarPrecioBruto() {
    const neto = parseFloat(this.precioNeto as any) || 0;
    const ivaPorcentaje = parseFloat(this.iva as any) || 0;
    this.precioBruto = parseFloat((neto * (1 + ivaPorcentaje / 100)).toFixed(2));
  }

  tieneDecimales(valor: string | number, limite: number): boolean {

    //Reemplaza la coma por punto para unificar el formato decimal
    const valorNormalizado = String(valor).replace(',', '.');

    //Verifica si hay parte decimal
    const partes = valorNormalizado.split('.');

    if (partes.length < 2) {
      return false; //No hay parte decimal
    }

    const decimales = partes[1];

    return decimales.length > limite;
  }

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      position: 'top',
      cssClass: 'toast',
    });

    await toast.present();
  }
}
