import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { SearchbarLayout } from "../../layouts/searchbar-layout/searchbar-layout";
import { Avaliacao, Categoria } from '../../models/types';
import { AvaliacaoService } from '../../services/avaliacao-service';
import { SseService } from '../../services/sse-service';

@Component({
  selector: 'app-avaliacoes-page',
  imports: [SearchbarLayout],
  templateUrl: './avaliacoes-page.html',
  styleUrl: './avaliacoes-page.css',
})
export class AvaliacoesPage implements OnInit{
  ava: Avaliacao[] = [];
  searchSelecionado = '';

  constructor(private avaliacaoService: AvaliacaoService, private cdr: ChangeDetectorRef, private sseService: SseService) {}

  ngOnInit(): void {
    this.autoSelecionar();
  }
  autoSelecionar() {
    const selecioando = this.searchBar[0]
    this.searchSelecionado = selecioando.nome;
    selecioando.funcao()
  }

  buscarAvaliacoes() {
    this.avaliacaoService.buscarTodos().subscribe({
      next: (res) => {
        this.ava = res;
        this.cdr.detectChanges();
      }
    });
  }
  searchBar = [
    {
      nome: 'Todos as avaliações',
      funcao: () => {
        this.searchSelecionado = 'Todos as avaliações';
        this.buscarAvaliacoes();
      },
      cargo: ['ADMIN']
    }
  ]
  private iniciarSse() {
        this.sseService.conectar().subscribe({
      next: (res) => {
        switch(res.tipo) {
          case 'CHAMADO_AVALIADO':
            this.buscarAvaliacoes();
            break;
        }
      }
    });
  }
}
