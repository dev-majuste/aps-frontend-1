import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Cargo, Usuario } from '../models/types';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  private readonly API = `${environment.apiUrl}/usuarios`

  constructor(private http: HttpClient) {}

  //Metodo para buscar todos os usuarios
  buscarTodos(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(this.API)
  }
  //Metodo para buscar usuario pelo id
  buscarPorId(id: number): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.API}/${id}`)
  }
  //Metodo para atualizar um usuario
  atualizar(id: number, usuario: Usuario): Observable<Usuario> {
    return this.http.put<Usuario>(`${this.API}/${id}`, usuario)
  }
  //Metodo para mudar o cargo de um usuario
  atualizarCargo(id: number, cargo: Cargo, idAdmin: number): Observable<Usuario> {
    const params = new HttpParams().set('idAdmin', idAdmin)
    return this.http.patch<Usuario>(`${this.API}/${id}`, JSON.stringify(cargo), { params, headers: { 'Content-Type': 'application/json' }});
  }
  //Metodo para remover um usuario
  remover(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API}/${id}`)
  }
}
