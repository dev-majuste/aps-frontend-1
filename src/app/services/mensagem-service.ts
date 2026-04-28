import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Mensagem } from '../models/types';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class MensagemService {
  private readonly API = 'http://localhost:8080/chamados'

  constructor(private http: HttpClient) {}

  //Metodo para buscar as mensagens de um chamado
  buscarMensagens(id: number): Observable<Mensagem[]> {
    return this.http.get<Mensagem[]>(`${this.API}/${id}/mensagens`);
  }

  //Metodo para mandar uma mensagem
  enviar(msg: Mensagem, id: number, idUsuario: number): Observable<Mensagem> {
    const params = new HttpParams().set('idUsuario', idUsuario.toString());
    return this.http.post<Mensagem>(`${this.API}/${id}/mensagens`, msg, {params});
  }
}
