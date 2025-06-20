import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonContent, IonHeader, IonTitle, IonToolbar, IonButton, IonAvatar, IonInput, IonButtons, IonBackButton, ToastController } from '@ionic/angular/standalone';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment.prod';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cambiar-avatar',
  templateUrl: './cambiar-avatar.page.html',
  styleUrls: ['./cambiar-avatar.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonButton, IonAvatar, IonInput, IonButtons, IonBackButton]
})
export class CambiarAvatarPage implements OnInit {

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  avatarUrl: string | null = null;

  constructor(private http: HttpClient, private router: Router, private toastController: ToastController) { }

  ngOnInit() {
    this.avatarUrl = localStorage.getItem('avatarUrl') || null; // Cargar el avatar desde el localStorage
  }

  selectImage() {
    this.fileInput.nativeElement.click();
  }


  uploadImage(event: any) {
  const file: File = event.target.files[0];
  if (!file) {
    return;
  }

  const reader = new FileReader();

  reader.onload = () => {
    const img = new Image();
    img.onload = () => {
      // Crear un canvas para redimensionar la imagen
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = 100;
      canvas.height = 100;

      // Dibujar la imagen redimensionada en el canvas
      ctx?.drawImage(img, 0, 0, 100, 100);

      // Obtener la imagen en base64 del canvas
      const resizedBase64 = canvas.toDataURL('image/jpeg', 0.7); // JPEG con calidad 0.7 para menor peso

      // Limpiar el prefijo data:image/jpeg;base64,
      const base64Data = resizedBase64.replace(/^data:image\/jpeg;base64,/, '');

      const formData = new FormData();
      formData.append('image', base64Data);


      const apiKey = '2f849a5d4dde177303747fa11e575984';

      this.http.post(`https://api.imgbb.com/1/upload?key=${apiKey}`, formData)
        .subscribe({
          next: (res: any) => {
            this.avatarUrl = res.data.url;
            console.log('Imagen subida', this.avatarUrl);
          },
          error: err => {
            console.error('Error al subir la imagen', err);
          }
        });
    };

    img.src = reader.result as string;
  };

  reader.readAsDataURL(file);
}

guardarAvatar() {
    
    const token = localStorage.getItem('accessToken');  // Obtener el token desde el localStorage
    if (!token) {
      console.log('No se encontró el token de acceso');
      return;
    }

    if (!this.avatarUrl || this.avatarUrl === localStorage.getItem('avatarUrl')) {
      this.presentToast('Selecciona una imagen para el avatar');
      return;
    }

    const url = environment.apiUrl + `/usuario/actualizarAvatar`; // URL de la API para actualizar el cliente

    fetch(url, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        avatarUrl: this.avatarUrl
      })
    })
      .then(response => response.text())
      .then(data => {
        if (data.trim() === 'Avatar actualizado') {
          this.presentToast('Avatar actualizado');
          localStorage.setItem('avatarUrl', this.avatarUrl || '');
          this.router.navigate(['/ajustes']);
        } else {
          this.presentToast('Error: ' + data);
        }
      })
      .catch(error => {
        console.error('Error en la solicitud:', error);
        alert('Error en la solicitud');
      });
  }

  cancelar() {
    this.router.navigate(['/ajustes']);
  }

  presentToast(message: string) {
    this.toastController.create({
      message: message,
      duration: 2000,
      position: 'top',
      cssClass: 'toast'
    }).then(toast => {
      toast.present();
    });
  }

}
