import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from "@angular/router";
import { AuthService } from '../../services/auth-service';
import { Usuario } from '../../models/types';
import { SseService } from '../../services/sse-service';

@Component({
  selector: 'app-navbar-layout',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar-layout.html',
  styleUrl: './navbar-layout.css',
})
export class NavbarLayout implements OnInit {
  @Input() usuario?: Usuario;

  constructor(private auth: AuthService, private sseService: SseService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.auth.usuarioLogado$.subscribe(user => {
      this.usuario = user;
      this.cdr.detectChanges();
    });
  }

  menu = [
    {
      texto: "Dashboard",
      rota: "/dashboard",
      imagem: "icons/dashboard.png",
      cargos: ['ADMIN']
    },
    {
      texto: "Chamados",
      rota: "/chamados",
      imagem: "icons/chat.png",
      cargos: ['CLIENTE', 'SUPORTE', 'ADMIN']
    },
    {
      texto: "Usuarios",
      rota: "/usuarios",
      imagem: "icons/users.png",
      cargos: ['ADMIN']
    },
    {
      texto: "Categorias",
      rota: "/categorias",
      imagem: "icons/letter.png",
      cargos: ['ADMIN']
    },
    {
      texto: "Avaliações",
      rota: "/avaliacoes",
      imagem: "icons/favorites.png",
      cargos: ['SUPORTE', 'ADMIN']
    }
  ];

  logout() {
    this.auth.logout();
  }
}
