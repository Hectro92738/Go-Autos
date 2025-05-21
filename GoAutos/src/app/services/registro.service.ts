import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable, from } from 'rxjs';
import { switchMap, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class RegistroService {
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

  // 🔐 Cabeceras para FormData (sin Content-Type manual)
  private getFormDataHeaders(token: string | null): HttpHeaders {
    return new HttpHeaders({
      Authorization: `Bearer ${token ?? ''}`,
    });
  }

  private handleError(error: any): Observable<never> {
    console.error('Error HTTP:', error);
    throw error;
  }

  //  ## ----- ----- -----
  //  ## ----- ----- -----

  preregistro(datos: any): Observable<any> {
    return this.http.post(`${environment.api_key}/users/pre-register`, datos);
  }

  validacioncodigo(datos: any): Observable<any> {
    return this.http.post(`${environment.api_key}/users/verify-code`, datos);
  }

  registro(datos: any): Observable<any> {
    return this.http.post(`${environment.api_key}/users/register`, datos);
  }

  // # LOGIN
  login(datos: any): Observable<any> {
    return this.http.post(`${environment.api_key}/users/login`, datos);
  }

  // # Guardar Autos
  guardarAutos(datos: FormData): Observable<any> {
    return from(this.obtenerToken()).pipe(
      switchMap((token) =>
        this.http.post(`${environment.api_key}/cars/vehiculos`, datos, {
          headers: this.getFormDataHeaders(token),
        })
      ),
      catchError((error) => this.handleError(error))
    );
  }



}
