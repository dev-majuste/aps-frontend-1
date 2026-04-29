import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { SearchbarLayout } from "../../layouts/searchbar-layout/searchbar-layout";
import { Categoria } from '../../models/types';
import { CategoriaService } from '../../services/categoria-service';
import { ModalLayout } from "../../layouts/modal-layout/modal-layout";

@Component({
  selector: 'app-categorias-page',
  imports: [SearchbarLayout, ModalLayout],
  templateUrl: './categorias-page.html',
  styleUrl: './categorias-page.css',
})
export class CategoriasPage implements OnInit {
  categorias: Categoria[] = [];
  exibirModalNovaCategoria: boolean = false;
  searchSelecionado = ''

  constructor(private categoriaService: CategoriaService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.carregarCategorias()
    this.autoSelecionar
  }

  autoSelecionar() {
    const selecioando = this.searchBar[0]
    this.searchSelecionado = selecioando.nome;
  }

  criarCategoria(titulo: string, descricao:  string) {
    if(titulo == null || descricao == null) {return}
    const categoria = {
      nome: titulo,
      descricao: descricao
    }
        this.categoriaService.criar(categoria as Categoria).subscribe({
          next: (res) => {
            this.carregarCategorias();
            this.exibirModalNovaCategoria = false;
          },
          error: (err) => {
            console.error('Erro ao criar um novo chamado:', err)
          }
        });
  }
  abrirNovaCategoria() {
    this.exibirModalNovaCategoria = true;
  }
  carregarCategorias() {
    this.categoriaService.buscarTodos().subscribe({
      next: (res) => {
        this.categorias = res;
        this.cdr.detectChanges();
      }
    });
  }

  searchBar = [
    {
      nome: 'Todas as Categorias',
      funcao: () => {
        this.searchSelecionado = 'Todas as Categorias';
        this.carregarCategorias();
      },
      cargo: ['ADMIN']
    }
  ]
}
