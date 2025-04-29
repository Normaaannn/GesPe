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
  ): Promise<boolean> {
    const token = localStorage.getItem('accessToken');
  
    if (token && !this.isTokenExpired(token)) {
      return Promise.resolve(true);
    }
  
    return this.tryRefreshToken().then(success => {
      if (success) {
        return true;
      } else {
        this.router.navigate(['/login']);
        return false;
      }
    });
  }

  private isTokenExpired(token: string): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expirationDate = new Date(payload.exp * 1000);
      return expirationDate <= new Date();
    } catch (e) {
      return true;
    }
  }
  
  private async tryRefreshToken(): Promise<boolean> {
    const refreshToken = localStorage.getItem('refreshToken');
  
    if (!refreshToken) {
      return false;
    }
  
    try {
      const response = await fetch('http://localhost:8080/auth/refresh', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken })
      });
  
      if (!response.ok) {
        return false;
      }
  
      const data = await response.json();
      localStorage.setItem('accessToken', data.accessToken);
      return true;
    } catch (error) {
      return false;
    }
  }
  
}