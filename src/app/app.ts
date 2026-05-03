import { ChangeDetectorRef, Component, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarLayout } from "./layouts/navbar-layout/navbar-layout";
import { SseService } from './services/sse-service';
import { AuthService } from './services/auth-service';
import { Usuario } from './models/types';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavbarLayout],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit{
  usuario?: Usuario;
  protected readonly title = signal('suporte-tecnico');
  mostrarNavbar: boolean = false;

  constructor(private sseService: SseService, private auth: AuthService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
// Escuta o estado do login para mostrar/esconder a Navbar
    this.auth.usuarioLogado$.subscribe(usuario => {
      this.mostrarNavbar = !!usuario;
      if (usuario) {
        this.usuario = usuario
      }
    });
  }
}
