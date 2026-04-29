import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { SearchbarLayout } from "../../layouts/searchbar-layout/searchbar-layout";
import { Categoria } from '../../models/types';
import { CategoriaService } from '../../services/categoria-service';

@Component({
  selector: 'app-categorias-page',
  imports: [SearchbarLayout],
  templateUrl: './categorias-page.html',
  styleUrl: './categorias-page.css',
})
export class CategoriasPage implements OnInit {
  categorias: Categoria[] = [];

  constructor(private categoriaService: CategoriaService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.carregarCategorias()
  }

  carregarCategorias() {
    this.categoriaService.buscarTodos().subscribe({
      next: (res) => {
        this.categorias = res;
        this.cdr.detectChanges();
      }
    });
  }
}
