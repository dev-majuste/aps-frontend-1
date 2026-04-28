import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Chamado } from '../models/types';

@Injectable({
  providedIn: 'root',
})
export class ChamadoService {
  private readonly API = 'http://localhost:8080/chamados'

  constructor(private http: HttpClient) {}

  //Metodo para buscar todos os chamados
  buscarTodos(): Observable<Chamado[]> {
    return this.http.get<Chamado[]>(this.API);
  }

  //Metodo para buscar chamados por usuario
  buscarPorUsuario(id: number): Observable<Chamado[]> {
    return this.http.get<Chamado[]>(`${this.API}/usuario/${id}`);
  }

  //Metodo para buscar o chamado pelo id do chamado
  buscarPorId(id: number, idUsuario: number): Observable<Chamado> {
    const params = new HttpParams().set('idUsuario', idUsuario.toString())
    return this.http.get<Chamado>(`${this.API}/${id}`, {params});
  }

  //Metodo para buscar o chamado pela categoria
  buscarPorCategoria(id: number): Observable<Chamado[]> {
    return this.http.get<Chamado[]>(`${this.API}/categoria/${id}`);
  }

  //Metodo para criar um novo chamado
  criar(chamado: Chamado, idUsuario: number): Observable<Chamado> {
    const params = new HttpParams().set('idUsuario', idUsuario.toString());
    return this.http.post<Chamado>(this.API, chamado, {params});
  }

  //Metodo para atender um chamado
  atender(id: number, idSuporte: number): Observable<Chamado> {
    const params = new HttpParams().set('idUsuario', idSuporte.toString());
    return this.http.patch<Chamado>(`${this.API}/${id}/atender`, {params});
  }

  //Metodo para finalizar um chamado
    finalizar(id: number, idSuporte: number): Observable<Chamado> {
    const params = new HttpParams().set('idUsuario', idSuporte.toString());
    return this.http.patch<Chamado>(`${this.API}/${id}/finalizar`, {params});
  }
}
