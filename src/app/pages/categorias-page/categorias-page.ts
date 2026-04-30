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
  exibirModalEditarCategoria: boolean = false;
  catSel?: Categoria;
  searchSelecionado = ''

  constructor(private categoriaService: CategoriaService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.autoSelecionar()
  }

  autoSelecionar() {
    const selecioando = this.searchBar[0]
    this.searchSelecionado = selecioando.nome;
    selecioando.funcao()
  }

  criarCategoria(titulo: string, descricao:  string) {
    if (!titulo || !descricao) {return}
    this.exibirModalNovaCategoria = false;
    const novaCategoria = {
      nome: titulo,
      descricao: descricao
    }
    this.categoriaService.criar(novaCategoria as Categoria).subscribe({
      next: (res) => {
        this.carregarCategorias()
      }
    })
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

  remover(id: number) {
    this.selecionarCat(id)
    this.categoriaService.remover(id).subscribe({
      next: (res) => {
        this.catSel = undefined;
        this.carregarCategorias();
      }
    })
  }

  selecionarCat(id: number) {
    this.categoriaService.buscarPorId(id).subscribe({
      next: (res) => {
        this.catSel = res;
        this.cdr.detectChanges();
      }
    })
  }

  abrirEditor(id: number) {
    this.selecionarCat(id);
    this.exibirModalEditarCategoria = true
  }
  atualizarCategoria(id: number, nome: string, descricao: string) {
    if(!nome || !descricao) {return}
    const novaCategoria = {
      nome: nome,
      descricao: descricao
    }
    this.categoriaService.atualizar(id, novaCategoria as Categoria).subscribe({
      next: (res) => {
        this.catSel = undefined;
        this.carregarCategorias()
        this.exibirModalEditarCategoria = false
      }
    })
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
