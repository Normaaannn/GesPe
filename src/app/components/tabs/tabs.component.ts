import { Component, OnInit } from '@angular/core';
import { IonTabBar, IonTabs, IonTabButton, IonLabel, IonIcon, IonTitle, IonButton, IonAvatar, IonFab, IonFabButton, IonContent } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { fileTrayFullOutline, peopleOutline, cubeOutline, people, cube, fileTrayFull, home, homeOutline } from 'ionicons/icons';
import { NavController } from '@ionic/angular';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.scss'],
  standalone: true,
  imports: [IonTabBar, IonTabs, IonTabButton, IonLabel, IonIcon, CommonModule, IonTitle, IonButton, IonAvatar, IonFab, IonFabButton, IonContent]
})
export class TabsComponent implements OnInit {

  currentRoute: string = '';
  esEscritorio: boolean = false;
  menuAbierto = false;
  avatarUrl: string | null = null;

  constructor(private navCtrl: NavController, private router: Router) {
    addIcons({
      fileTrayFullOutline, peopleOutline, cubeOutline, fileTrayFull, people, cube, home, homeOutline
    })
    this.currentRoute = window.location.pathname;
  }

  ngOnInit() {
    // Detectar cambios de ruta automáticamente
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.currentRoute = event.urlAfterRedirects;
      });
    this.checkScreen();
    window.addEventListener('resize', this.checkScreen.bind(this));
    this.loadAvatar();
  }

  checkScreen() {
    this.esEscritorio = window.innerWidth >= 1024;
  }

  navigateTo(path: string) {
    this.navCtrl.navigateForward(path, {
      animated: false
    });
    this.currentRoute = path;
  }

  //Verifico si la ruta está activa
  isActive(route: string): boolean {
    return this.currentRoute === route;
  }

  loadAvatar() {
    this.avatarUrl = localStorage.getItem('avatarUrl');  // Obtener el avatar desde el localStorage
    if (!this.avatarUrl) {
      this.avatarUrl = "https://ionicframework.com/docs/img/demos/avatar.svg";
    }
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

}
