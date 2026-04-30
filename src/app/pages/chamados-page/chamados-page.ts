import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { SearchbarLayout } from "../../layouts/searchbar-layout/searchbar-layout";
import { Cargo, Categoria, Chamado, Status, Usuario } from '../../models/types';
import { AuthService } from '../../services/auth-service';
import { ChamadoService } from '../../services/chamado-service';
import { ModalLayout } from '../../layouts/modal-layout/modal-layout';
import { CategoriaService } from '../../services/categoria-service';
import { Router, RouterLink } from '@angular/router';
import { UsuarioService } from '../../services/usuario-service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-chamados-page',
  imports: [SearchbarLayout, ModalLayout],
  templateUrl: './chamados-page.html',
  styleUrl: './chamados-page.css',
})
export class ChamadosPage implements OnInit{
  usuario?: Usuario;
  chamados: Chamado[] = [];
  categorias: Categoria[] = [];
  searchSelecionado = '';
  exibirModalNovoChamado: boolean = false;

  constructor(
    private auth: AuthService, 
    private chamadoService: ChamadoService, 
    private categoriaService: CategoriaService, 
    private cdr: ChangeDetectorRef,
    private usuarioService: UsuarioService,
    private rota: Router
  )  {}

  ngOnInit(): void {
    this.usuario = this.auth.getUsuario();
    if(!this.usuario) {return}
    this.autoSelecionar()
  }

  abrirChamado(id: number, status: Status) {
    if (!this.usuario) {return}
    if (status != Status.EM_ABERTO) {this.rota.navigate(['/chamado',id])}
    if (this.usuario.cargo != Cargo.CLIENTE) {
      this.atenderChamado(id)
    }
  }

  atenderChamado(id: number) {
    if(!this.usuario) {return}
    this.chamadoService.atender(id, this.usuario.id).subscribe({
      next: (res) => {
        this.rota.navigate(['/chamado',id])
      }
    })
  }

  autoSelecionar() {
    const cargoUsuario = this.usuario?.cargo
    const items = this.searchBar.filter(item => item.cargo.includes(cargoUsuario as Cargo))
    items[0].funcao(Number(this.usuario?.id));
  }

  meusChamados() {
    if (!this.usuario?.id) {return}

    this.chamadoService.buscarPorUsuario(this.usuario.id).subscribe({
      next: (dados) => {
        this.chamados = dados;
      },
      error: (err) => {
        console.error('Erro ao buscar chamados:', err);
      }
    });
  }
  //Aqui o id é do usuario para verificação
  todosChamados(id?: number) {
    if (!this.usuario?.id) {return}

    this.chamadoService.buscarTodos().subscribe({
      next: (dados) => {
        this.chamados = dados;
        this.cdr.detectChanges()
      },
      error: (err) => {
        console.error('Erro ao buscar chamados:', err);
      }
    });
  }
  emAtendimento(id: number) {
    //Buscar chamados em que o tecnico esta atendendo
    this.todosChamados()
    if(!this.usuario) {return}
    let lista: Chamado[] = [];
    this.chamados.forEach(c => {
      if (c.cliente.cargo == this.usuario?.cargo) {
        lista.push(c)
      }
    })
    this.chamados = lista;

  }
  emAberto(id: number) {
    //Buscar chamados em que o status seja "EM_ABERTO"
    if(!this.usuario) {return}
    this.todosChamados()
    let lista: Chamado[] = []
    this.chamados.forEach(c => {
      if(c.status == Status.EM_ABERTO) {
        lista.push(c)
      }
    })

  }
  //Novo chamado
  abrirNovoChamado() {
    this.exibirModalNovoChamado = true;
    this.carregarCategorias()
  }
  criarChamado(titulo: string, descricao: string, categoria: any) {
    if(!this.usuario) {return;}
    if(!titulo || !descricao || !categoria || categoria == "") {return;}

    const novoChamado = {
      titulo: titulo,
      descricao: descricao,
      categoria: {
        id: categoria
      }
    }

    this.chamadoService.criar(novoChamado as Chamado, this.usuario.id).subscribe({
      next: (res) => {
        this.meusChamados();

        this.exibirModalNovoChamado = false;
      },
      error: (err) => {
        console.error('Erro ao criar um novo chamado:', err)
      }
    });
  }

  carregarCategorias() {
    this.categoriaService.buscarTodos().subscribe({
      next: (res) => {
        console.log("DADOS CARREGADOS")
        this.categorias = res;
        this.cdr.detectChanges()
      },
      error: (err) => console.error('Erro ao carregar categorias', err)
    });
  }

   getStyleStatus(status: Status): string {
    switch (status) {
      case Status.EM_ABERTO: return 'status-aberto';
      case Status.EM_ANDAMENTO: return 'status-andamento';
      case Status.FINALIZADO: return 'status-finalizado';
      default: return 'status-aguardando';
    }
  }

  searchBar = [
    {
      nome: 'Meus chamados',
      funcao: (id?: number) => {
        this.searchSelecionado = 'Meus chamados';
        this.meusChamados();
      },
      cargo: ['CLIENTE']
    },
    {
      nome: 'Todos os chamados',
      funcao: (id: number) => {
        this.searchSelecionado = 'Todos os chamados';
        this.todosChamados(id)},
      cargo: ['SUPORTE','ADMIN']
    },
    {
      nome: 'Em atendimento',
      funcao: (id: number) => {
        this.searchSelecionado = 'Em atendimento';
        this.emAtendimento(id)},
      cargo: ['SUPORTE','ADMIN']
    },
    {
      nome: 'Em aberto',
      funcao: (id: number) => {
        this.searchSelecionado = 'Em aberto';
        this.emAberto(id)},
      cargo: ['SUPORTE','ADMIN']
    }
  ]
}
