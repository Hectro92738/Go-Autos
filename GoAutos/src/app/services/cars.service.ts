import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable, from } from 'rxjs';
import { switchMap, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class CarsService {
  constructor(private http: HttpClient) {}

  //  ## ----- ----- -----
  //  ## ----- ----- -----
  private async obtenerToken(): Promise<string | null> {
    return localStorage.getItem('token');
  }

  // 🔐 Cabeceras para JSON
  private getJsonHeaders(token: string | null): HttpHeaders {
    return new HttpHeaders({
      Authorization: `Bearer ${token ?? ''}`,
      'Content-Type': 'application/json',
    });
  }

  private handleError(error: any): Observable<never> {
    console.error('Error HTTP:', error);
    throw error;
  }

  // ☢️ ## ----- PETICIONES
  getCarsNews(): Observable<any> {
    return from(this.obtenerToken()).pipe(
      switchMap((token) => {
        const headers = this.getJsonHeaders(token);
        return this.http.get(`${environment.api_key}/cars/vehiculos`, {
          headers,
        });
      }),
      catchError((error) => this.handleError(error))
    );
  }
}
