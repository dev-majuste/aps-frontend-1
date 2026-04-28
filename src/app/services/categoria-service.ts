import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Categoria } from '../models/types';

@Injectable({
  providedIn: 'root',
})
export class CategoriaService {
  private readonly API = 'http://localhost:8080/categorias'

  constructor(private http: HttpClient) {}

  //Metodo para buscar todas as categorias
  buscarTodos(): Observable<Categoria[]> {
    return this.http.get<Categoria[]>(this.API);
  }
  //Metodo para buscar por id
  buscarPorId(id: number): Observable<Categoria> {
    return this.http.get<Categoria>(`${this.API}/${id}`);
  }
  //Metodo para criar uma nova categoria
  criar(categoria: Categoria): Observable<Categoria> {
    return this.http.post<Categoria>(this.API, categoria);
  }
  //Metodo para atualizar uma categoria
  atualizar(id: number, categoria: Categoria): Observable<Categoria> {
    return this.http.put<Categoria>(`${this.API}/${id}`, categoria);
  }
  //Metodo para excluir uma categoria
  remover(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API}/${id}`);
  }
}
