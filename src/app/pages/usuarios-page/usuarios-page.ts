import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { SearchbarLayout } from "../../layouts/searchbar-layout/searchbar-layout";
import { Cargo, Usuario } from '../../models/types';
import { UsuarioService } from '../../services/usuario-service';
import { firstValueFrom, Observable } from 'rxjs';
import { AuthService } from '../../services/auth-service';
import { ModalLayout } from "../../layouts/modal-layout/modal-layout";

@Component({
  selector: 'app-usuarios-page',
  imports: [SearchbarLayout, ModalLayout],
  templateUrl: './usuarios-page.html',
  styleUrl: './usuarios-page.css',
})
export class UsuariosPage implements OnInit {
  usuarios: Usuario[] = [];
  CargoEnum = Cargo;
  cargos = Object.values(Cargo)
  userEditor: Usuario | undefined;
  exibirModalEditor: boolean = false;
  searchSelecionado = ''

  constructor(private usuarioService: UsuarioService, private cdr: ChangeDetectorRef, private auth: AuthService) {}

  async ngOnInit() {
    this.autoSelecionar()
  }
  autoSelecionar() {
    const selecioando = this.searchBar[0]
    this.searchSelecionado = selecioando.nome;
    selecioando.funcao()
  }

  carregarUsuarios() {
    this.usuarioService.buscarTodos().subscribe({
      next: (res) => {
        this.usuarios = res
        this.cdr.detectChanges();
      }
    });
  }

  async abrirEditor(id: number) {
    this.userEditor = await this.buscarUsuario(id);
    this.exibirModalEditor = true;
  }
    remover(id: number) {
    if (this.auth.getUsuario().id == id) {return}
    this.usuarioService.remover(id).subscribe({
      next: (res) => {
        this.carregarUsuarios()
      }
    })
  }
  async atualizarDados(id: number, nome: string, email: string, cargoVindoDoHtml: string) {
    // 1. Converte a string do HTML para o seu tipo Cargo (Enum)
    const cargo = cargoVindoDoHtml as Cargo;

    // 2. Busca o usuário atual (você já usa await aqui, perfeito)
    const user = await this.buscarUsuario(id);

    const novoUsuario: Usuario = {
      id: id,
      nome: nome,
      email: email,
      cargo: cargo
    };

    // 3. Se o cargo mudou, você PRECISA esperar essa atualização terminar 
    // antes de atualizar o restante do usuário
    if (cargo !== user.cargo) {
      try {
        // Usamos firstValueFrom para transformar o Observable em Promise e dar 'await'
        await firstValueFrom(this.usuarioService.atualizarCargo(id, cargo, this.auth.getUsuario().id));
        console.log("Cargo atualizado com sucesso");
      } catch (error) {
        console.error("Erro ao atualizar cargo:", error);
      }
    }

    // 4. Agora sim, atualiza os dados gerais e fecha o modal
    this.usuarioService.atualizar(id, novoUsuario).subscribe({
      next: (res) => {
        this.exibirModalEditor = false;
        this.carregarUsuarios();
      },
      error: (err) => {
        console.error("Erro ao atualizar dados:", err);
      }
    });
}
  async buscarUsuario(id: number): Promise<Usuario> {
    let user: Usuario;
    user = await firstValueFrom(this.usuarioService.buscarPorId(id));
    return user; 
  }
  searchBar = [
    {
      nome: 'Todos os Usuarios',
      funcao: () => {
        this.searchSelecionado = 'Todos os Usuarios';
        this.carregarUsuarios();
      },
      cargo: ['ADMIN']
    }
  ]
}
