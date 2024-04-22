import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { LogoutComponent } from './pages/logout/logout.component';
import { AuthGuard } from './guards/auth.guard';
import { MultasComponent } from './pages/multas/multas.component';
import { CrearMultaComponent } from './pages/crear-multa/crear-multa.component';
import { EditarMultaComponent } from './pages/editar-multa/editar-multa.component';
import { VerMultaComponent } from './pages/ver-multa/ver-multa.component';
import { LoginGuard } from './guards/login.guard';
import { CuentacorrienteComponent } from './pages/cuentacorriente/cuentacorriente.component';
import { CoactivoComponent } from './pages/coactivo/coactivo.component';
import { CoactivoCrearComponent } from './pages/coactivo-crear/coactivo-crear.component';
import { CoactivoVerComponent } from './pages/coactivo-ver/coactivo-ver.component';
import { CosgasComponent } from './pages/cosgas/cosgas.component';


export const ROUTES: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'logout', component: LogoutComponent, canActivate: [AuthGuard] },

  //Multas
  { path: 'multas', component: MultasComponent, canActivate: [AuthGuard] },
  { path: 'multas/crear-multa', component: CrearMultaComponent, canActivate: [AuthGuard] },
  { path: 'multas/editar-multa', component: EditarMultaComponent, canActivate: [AuthGuard] },
  { path: 'multas/ver-multa/:id', component: VerMultaComponent, canActivate: [AuthGuard] },

  //Cuenta Corriente
  { path: 'cuentacorriente', component: CuentacorrienteComponent, canActivate: [AuthGuard] },
  { path: 'coactivo', component: CoactivoComponent, canActivate: [AuthGuard] },

  //Expediente
  { path: 'coactivo/crear', component: CoactivoCrearComponent, canActivate: [AuthGuard] },
  { path: 'coactivo/ver/:id', component: CoactivoVerComponent, canActivate: [AuthGuard] },

  //COSTAS Y GASTOS
  {path: 'cosgas/:id',component:CosgasComponent,canActivate:[AuthGuard]},

  { path: '', pathMatch: 'full', redirectTo: 'login' },
  { path: '**', pathMatch: 'full', redirectTo: 'login' },
];
