import { Routes } from '@angular/router';
import { LoginPage } from './pages/login-page/login-page';
import { ChamadosPage } from './pages/chamados-page/chamados-page';
import { authGuard } from './guards/auth-guard';
import { RegisterPage } from './pages/register-page/register-page';
import { DashboardPage } from './pages/dashboard-page/dashboard-page';
import { UsuariosPage } from './pages/usuarios-page/usuarios-page';
import { CategoriasPage } from './pages/categorias-page/categorias-page';
import { AvaliacoesPage } from './pages/avaliacoes-page/avaliacoes-page';
import { ChamadoMensagensPage } from './pages/chamado-mensagens-page/chamado-mensagens-page';
import { MensagensPage } from './pages/mensagens-page/mensagens-page';

export const routes: Routes = [
    {path: 'login', component: LoginPage},
    {path: 'register', component: RegisterPage},
    {path: 'chamados', component: ChamadosPage, canActivate: [authGuard]},
    {path: 'dashboard', component: DashboardPage, canActivate: [authGuard]},
    {path: 'usuarios', component: UsuariosPage, canActivate: [authGuard]},
    {path: 'categorias', component: CategoriasPage, canActivate: [authGuard]},
    {path: 'avaliacoes', component: AvaliacoesPage, canActivate: [authGuard]},
    {path: 'chamado/:id', component: MensagensPage, canActivate: [authGuard]},
    {path: '', redirectTo: 'chamados', pathMatch: 'full'},
    {path: '**', redirectTo: 'chamados'}
];
