import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(
  next: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
): Observable<boolean> | Promise<boolean> | boolean {
  const token = localStorage.getItem('accessToken');

  if (token) {
    // Decodificar el token y verificar su fecha de expiración
    const tokenPayload = this.decodeToken(token);
    const expirationDate = new Date(tokenPayload.exp * 1000); // Convertir el exp a fecha
    if (expirationDate > new Date()) {
      return true;  // Token válido
    }
  }

  // Si el token no es válido o no existe, redirige al login
  this.router.navigate(['/login']);
  return false;
}

// Función para decodificar el token (ejemplo simple)
decodeToken(token: string): any {
  const payload = token.split('.')[1];
  return JSON.parse(atob(payload)); // Decodifica el payload del JWT
}
}