import { Component, OnInit, signal } from '@angular/core';
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

  constructor(private sseService: SseService, private auth: AuthService) {}

  ngOnInit(): void {
// Escuta o estado do login para mostrar/esconder a Navbar
    this.auth.usuarioLogado$.subscribe(usuario => {
      this.mostrarNavbar = !!usuario; // true se houver usuário, false se for null
      
      // Opcional: Só conecta no SSE se estiver logado
      //Verificar se vai logar com um await
      if (usuario) {
        this.iniciarSse();
        this.usuario = usuario
      }
    });
  }

  private iniciarSse() {
        this.sseService.conectar().subscribe({
      next: (res) => {
        switch(res.tipo) {
          case 'NOVA_MENSAGEM':
            console.log("NOVA MENSAGEM");
            break;
          case 'USUARIO_ATUALIZADO':
          case 'CARGO_ATUALIZADO':
            this.auth.atualizarLocalStorage(res.conteudo);
            break;
        }
      }
    });
  }
}
