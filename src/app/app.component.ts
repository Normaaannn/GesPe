import { Component } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { HomePage } from './pages/home/home.page';
import { ClientesPage } from './pages/clientes/clientes.page';
import { ProductosPage } from './pages/productos/productos.page';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',

  imports: [IonApp, IonRouterOutlet, ClientesPage, HomePage, ProductosPage],
})
export class AppComponent {
  constructor() {}
}
