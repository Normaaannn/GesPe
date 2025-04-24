import { Component, OnInit  } from '@angular/core';
import { IonTabBar, IonTabs, IonTabButton, IonLabel, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { fileTrayFullOutline, peopleOutline, cubeOutline, people, cube, fileTrayFull, navigate} from 'ionicons/icons';
import { NavController } from '@ionic/angular';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.scss'],
  standalone: true,
  imports: [IonTabBar, IonTabs, IonTabButton, IonLabel, IonIcon]
})
export class TabsComponent implements OnInit {

  currentRoute: string = '';

  constructor(private navCtrl: NavController, private router: Router) { 
    addIcons({
      fileTrayFullOutline, peopleOutline, cubeOutline, fileTrayFull, people, cube
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
  
}
