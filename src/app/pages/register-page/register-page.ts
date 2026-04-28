import { Component } from '@angular/core';
import { AuthLayout } from "../../layouts/auth-layout/auth-layout";
import { AuthService } from '../../services/auth-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register-page',
  imports: [AuthLayout],
  templateUrl: './register-page.html',
  styleUrl: './register-page.css',
})
export class RegisterPage {

  constructor(private auth: AuthService, private rota: Router) {}

  registrar(nomeInput: string, emailInput: string, senhaInput: string) {
    const dados = {
      nome: nomeInput,
      email: emailInput,
      senha: senhaInput
    }

    this.auth.registrar(dados).subscribe({
      next: (res) => {
        this.rota.navigate(['/chamados'])
      }
    })
  }
}
