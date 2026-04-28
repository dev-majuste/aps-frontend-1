import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Avaliacao } from '../models/types';

@Injectable({
  providedIn: 'root',
})
export class AvaliacaoService {
  private readonly API = 'http://localhost:8080/chamados'

  constructor(private http: HttpClient) {}
  
  //Metodo para buscar todas as avaliações
  buscarTodos(): Observable<Avaliacao[]> {
    return this.http.get<Avaliacao[]>(`${this.API}/avaliacoes`);
  }
  //Metodo para buscar avaliação por id
  buscarPorId(id: number): Observable<Avaliacao> {
    return this.http.get<Avaliacao>(`${this.API}/${id}/avaliacao`)
  }
  //Metodo para criar uma avalição
  criar(id: number, avaliacao: Avaliacao, idUsuario: number): Observable<Avaliacao> {
    const params = new HttpParams().set('idUsuario', idUsuario)
    return this.http.post<Avaliacao>(`${this.API}/${id}`, avaliacao, {params})
  }
}
