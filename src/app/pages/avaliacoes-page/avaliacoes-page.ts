import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { SearchbarLayout } from "../../layouts/searchbar-layout/searchbar-layout";
import { Avaliacao, Categoria } from '../../models/types';
import { AvaliacaoService } from '../../services/avaliacao-service';

@Component({
  selector: 'app-avaliacoes-page',
  imports: [SearchbarLayout],
  templateUrl: './avaliacoes-page.html',
  styleUrl: './avaliacoes-page.css',
})
export class AvaliacoesPage implements OnInit{
  ava: Avaliacao[] = [];
  a: Categoria[] = [];

  constructor(private avaliacaoService: AvaliacaoService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.buscarAvaliacoes();
  }

  buscarAvaliacoes() {
    this.avaliacaoService.buscarTodos().subscribe({
      next: (res) => {
        this.ava = res;
        this.cdr.detectChanges();
      }
    });
  }
}
