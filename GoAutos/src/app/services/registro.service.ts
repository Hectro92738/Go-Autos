import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RegistroService {
  constructor(private http: HttpClient) {}

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



}
