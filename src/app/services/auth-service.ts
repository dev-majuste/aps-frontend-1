import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { Usuario } from '../models/types';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly API = `${environment.apiUrl}/usuarios`; //URL do endpoint(api rest)

  constructor(private http: HttpClient, private router: Router) {}

  // Começa com o que estiver no localStorage (null se estiver vazio)
  private usuarioSubject = new BehaviorSubject<any>(this.getUsuario());
  
  // Observable que os componentes vão assinar
  usuarioLogado$ = this.usuarioSubject.asObservable();

  //Metodo de logar
  public login(data: any): Observable<any> {
    return this.http.post(`${this.API}/login`, data).pipe(
      tap((usuario: any) => {
        localStorage.setItem('usuario', JSON.stringify(usuario))
        this.usuarioSubject.next(usuario);
      })
    )
  }

  //Metodo de registrar
  public registrar(data: any): Observable<any> {
    return this.http.post(this.API, data)
  }

  //Metodo que verifica se o usuario esta logado
  public estaLogado(): boolean {
    return !!localStorage.getItem('usuario');
  }

  //Metodo que pega o usuario logado no localStorage
  public getUsuario() {
    const data = localStorage.getItem('usuario');
    return data ? JSON.parse(data) : null
  }

  //Metood para atualizar o localStorage
  public atualizarLocalStorage(id: number): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.API}/${id}`).pipe(
      tap((usuario: Usuario) => {
        localStorage.setItem('usuario', JSON.stringify(usuario))
        this.usuarioSubject.next(usuario)
      })
    )
  }

  //Metodo de logout
  public logout() {
    localStorage.removeItem('usuario');
    this.usuarioSubject.next(null);
    this.router.navigate(['/login'])
  }
 }
