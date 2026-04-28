import { Component } from '@angular/core';
import { AuthLayout } from "../../layouts/auth-layout/auth-layout";
import { Router } from "@angular/router";
import { AuthService } from '../../services/auth-service';

@Component({
  selector: 'app-login-page',
  imports: [AuthLayout],
  templateUrl: './login-page.html',
  styleUrl: './login-page.css',
})
export class LoginPage {

  constructor(private auth: AuthService, private rota: Router) {}

  logar(emailInput: string, senhaInput: string) {
    const dados = {
      email: emailInput,
      senha: senhaInput
    };
    this.auth.login(dados).subscribe({
      next: (res) => {
        this.rota.navigate(['/chamados']);
      }
    })
  }
}
