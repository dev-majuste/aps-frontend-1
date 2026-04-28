import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Chamado, Mensagem, Usuario } from '../../models/types';
import { AuthService } from '../../services/auth-service';
import { ChamadoService } from '../../services/chamado-service';
import { MensagemService } from '../../services/mensagem-service';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-mensagens-page',
  imports: [ CommonModule ],
  templateUrl: './mensagens-page.html',
  styleUrl: './mensagens-page.css',
})
export class MensagensPage implements OnInit{
  id: number | null = null;
  mensagens: Mensagem[] = [];
  chamado?: Chamado;
  usuario?: Usuario;

  constructor(
    private auth: AuthService,
    private chamadoService: ChamadoService,
    private msgService: MensagemService,
    private rota: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.id = Number(this.rota.snapshot.paramMap.get('id'));
    this.usuario = this.auth.getUsuario();

    if(!this.usuario || !this.id) {return;}

    this.buscarDadosChamado();
    this.buscarMensagens();
  }

  buscarDadosChamado() {
    if (this.id && this.usuario) {
      this.chamadoService.buscarPorId(this.id, this.usuario.id).subscribe({
        next: (res) => {
          this.chamado = res;
          this.cdr.detectChanges();
        },
        error: (err) => console.error('Erro ao carregar chamado:', err)
      });
    }
  }

  buscarMensagens() {
    if (this.id) {
      this.msgService.buscarMensagens(this.id).subscribe({
        next: (res) => {
          this.mensagens = res;
          this.cdr.detectChanges();
        },
        error: (err) => console.error('Erro ao carregar mensagens:', err)
      });
    }
  }

  enviar(msg: string) {
    if (!msg.trim() || !this.id || !this.usuario) return;

    const mensagem = {
      mensagem: msg
    }

    this.msgService.enviar(mensagem as Mensagem, this.id, this.usuario.id).subscribe({
      next: (res) => {
        this.mensagens.push(res);
        this.buscarDadosChamado();
      }
    });
  }
}
