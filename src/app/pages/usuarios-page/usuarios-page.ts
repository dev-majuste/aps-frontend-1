import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { SearchbarLayout } from "../../layouts/searchbar-layout/searchbar-layout";
import { Usuario } from '../../models/types';
import { UsuarioService } from '../../services/usuario-service';

@Component({
  selector: 'app-usuarios-page',
  imports: [SearchbarLayout],
  templateUrl: './usuarios-page.html',
  styleUrl: './usuarios-page.css',
})
export class UsuariosPage implements OnInit {
  usuarios: Usuario[] = [];

  constructor(private usuarioService: UsuarioService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.carregarUsuarios();
  }

  carregarUsuarios() {
    this.usuarioService.buscarTodos().subscribe({
      next: (res) => {
        this.usuarios = res
        this.cdr.detectChanges();
      }
    });
  }
}
