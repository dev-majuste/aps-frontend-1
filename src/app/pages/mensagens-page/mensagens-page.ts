import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Avaliacao, Chamado, Mensagem, Status, Usuario } from '../../models/types';
import { AuthService } from '../../services/auth-service';
import { ChamadoService } from '../../services/chamado-service';
import { MensagemService } from '../../services/mensagem-service';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AvaliacaoService } from '../../services/avaliacao-service';
import { UsuarioService } from '../../services/usuario-service';
import { ModalLayout } from "../../layouts/modal-layout/modal-layout";
import { SseService } from '../../services/sse-service';

@Component({
  selector: 'app-mensagens-page',
  imports: [CommonModule, ModalLayout],
  templateUrl: './mensagens-page.html',
  styleUrl: './mensagens-page.css',
})
export class MensagensPage implements OnInit{
  id: number | null = null;
  mensagens: Mensagem[] = [];
  chamado?: Chamado;
  usuario?: Usuario;
  avaliacao?: Avaliacao;
  foiAvaliado: boolean = false;
  exibirModalAvaliar: boolean = false;

  constructor(
    private auth: AuthService,
    private chamadoService: ChamadoService,
    private msgService: MensagemService,
    private rota: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private avaService: AvaliacaoService,
    private usuarioService: UsuarioService,
    private sseService: SseService
  ) {}

  ngOnInit(): void {
    this.id = Number(this.rota.snapshot.paramMap.get('id'));
    this.usuario = this.auth.getUsuario();

    if(!this.usuario || !this.id) {return;}
    this.avaService.buscarPorId(this.id).subscribe({
      next: (res) => {
        this.foiAvaliado = true
      }
    })

    this.buscarDadosChamado();
    this.buscarMensagens();
    this.buscarAvaliacao();
    this.iniciarSse();
  }

  buscarAvaliacao() {
    if(!this.id && !this.usuario) {return}
    this.avaService.buscarPorId(Number(this.id)).subscribe({
      next: (res) => {
        this.avaliacao = res
        this.cdr.detectChanges()
      }
    })
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
  finalizarChamado() {
    if(!this.chamado || !this.usuario) {return}
    if(this.usuario.cargo == 'CLIENTE') {return}
    this.chamadoService.finalizar(this.chamado.id, this.usuario.id).subscribe({
      next: (res) => {
        this.cdr.detectChanges()
      }
    })
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
        this.buscarMensagens()
        this.buscarDadosChamado();
        this.cdr.detectChanges();
      }
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

    abrirAvaliar() {
      if (this.foiAvaliado) {return}
      this.exibirModalAvaliar = true
    }
    avaliar(id: number, nota: number, comentario: string, idUsuario: number) {
      const avaliacao = {
        nota: nota,
        mensagem: comentario
      }
      this.avaService.criar(id, avaliacao as Avaliacao, idUsuario).subscribe({
        next: (res) => {
          this.buscarDadosChamado()
        }
      })
    }
    private iniciarSse() {
        this.sseService.conectar().subscribe({
      next: (res) => {
        switch(res.tipo) {
          case 'NOVA_MENSAGEM':
            this.buscarMensagens;
            this.buscarDadosChamado;
            break;
        }
      }
    });
  }
}
