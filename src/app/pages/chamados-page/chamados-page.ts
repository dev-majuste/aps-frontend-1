import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { SearchbarLayout } from "../../layouts/searchbar-layout/searchbar-layout";
import { Cargo, Categoria, Chamado, Status, Usuario } from '../../models/types';
import { AuthService } from '../../services/auth-service';
import { ChamadoService } from '../../services/chamado-service';
import { ModalLayout } from '../../layouts/modal-layout/modal-layout';
import { CategoriaService } from '../../services/categoria-service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SseService } from '../../services/sse-service';

@Component({
  selector: 'app-chamados-page',
  standalone: true,
  imports: [SearchbarLayout, ModalLayout, CommonModule],
  templateUrl: './chamados-page.html',
  styleUrl: './chamados-page.css',
})
export class ChamadosPage implements OnInit{
  usuario?: Usuario;
  chamados: Chamado[] = [];
  categorias: Categoria[] = [];
  searchSelecionado = '';
  exibirModalNovoChamado: boolean = false;
  criandoChamado: boolean = true;

  constructor(
    private auth: AuthService, 
    private chamadoService: ChamadoService, 
    private categoriaService: CategoriaService, 
    private cdr: ChangeDetectorRef,
    private sseService: SseService,
    private rota: Router
  )  {}

  ngOnInit(): void {
    this.usuario = this.auth.getUsuario();
    if(!this.usuario) {return}
    this.autoSelecionar()
    this.iniciarSse()
  }

  abrirChamado(id: number, status: Status) {
    if (!this.usuario) {return}
    if (status != Status.EM_ABERTO) {this.rota.navigate(['/chamado',id])}
    else if (this.usuario.cargo != Cargo.CLIENTE) {
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
        this.cdr.detectChanges()
      },
      error: (err) => {
        console.error('Erro ao buscar chamados:', err);
      }
    });
  }
  //Aqui o id é do usuario para verificação
  todosChamados(id?: number) {
    if (!this.usuario) {return}
    this.chamadoService.buscarTodos().subscribe({
      next: (res) => {
        if (this.usuario?.cargo == Cargo.SUPORTE) {
          this.chamados = res.filter(c => c.tecnico?.id === this.usuario?.id)
        } else {
          this.chamados = res
        }
        this.searchSelecionado = 'Todos os chamados'
        this.cdr.detectChanges()
      }
    })
  }
  emAtendimento(id: number) {
    if (!this.usuario) return;
    this.chamadoService.buscarTodos().subscribe({
      next: (dados) => {
        this.chamados = dados.filter(c => 
          c.tecnico?.id === this.usuario?.id && 
          c.status !== Status.EM_ABERTO &&
          c.status !== Status.RESOLVIDO
        );
        this.searchSelecionado = 'Em atendimento';
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Erro ao filtrar atendimentos:', err)
    });
  }
  emAberto(id: number) {
    if(!this.usuario) {return}
    this.chamadoService.buscarTodos().subscribe({
      next: (res) => {
        this.chamados = res.filter(c => c.tecnico?.id === undefined && c.status === Status.EM_ABERTO);
        this.searchSelecionado = 'Em aberto'
        this.cdr.detectChanges()
      }
    })
  }
  //Novo chamado
  abrirNovoChamado() {
    this.exibirModalNovoChamado = true;
    this.criandoChamado = false;
    this.carregarCategorias()
  }
  criarChamado(titulo: string, descricao: string, categoria: any) {
  if (!this.usuario || this.criandoChamado) return; // Trava cliques duplos
  if (!titulo || !descricao || !categoria) return;

  this.criandoChamado = true;

  const novoChamado = {
    titulo,
    descricao,
    categoria: { id: categoria }
  };

  this.chamadoService.criar(novoChamado as Chamado, this.usuario.id).subscribe({
    next: (res) => {
      this.exibirModalNovoChamado = false;
      this.cdr.detectChanges(); 
      this.criandoChamado = false;
      this.recarregarSearch();
    },
    error: (err) => {
      console.error('Erro ao criar um novo chamado:', err);
      this.criandoChamado = false;
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
      case Status.RESOLVIDO: return 'status-resolvido';
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
  recarregarSearch() {
    if (this.searchSelecionado == '') {return}
    for(let i =0; i < this.searchBar.length; i++) {
      if (this.searchBar[i].nome == this.searchSelecionado) {
        this.searchBar[i].funcao(Number(this.usuario?.id))
      }
    }
  }
  private iniciarSse() {
        this.sseService.conectar().subscribe({
      next: (res) => {
        switch(res.tipo) {
          case 'NOVA_MENSAGEM':
          case 'CHAMADO_ATENDIDO':
          case 'CHAMADO_FINALIZADO':
          case 'CHAMADO_AVALIADO':
            this.recarregarSearch()
            break;
        }
      }
    });
  }
}
