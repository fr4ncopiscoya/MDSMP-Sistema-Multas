import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { LogoutComponent } from './pages/logout/logout.component';
import { AuthGuard } from './guards/auth.guard';
import { PersonaComponent } from './pages/persona/persona.component';
import { CrearPersonaComponent } from './pages/crear-persona/crear-persona.component';
import { CrearCarneComponent } from './pages/crear-carne/crear-carne.component';
import { CrearCertificadoComponent } from './pages/crear-certificado/crear-certificado.component';
import { CarneComponent } from './pages/carne/carne.component';
import { CertificadoComponent } from './pages/certificado/certificado.component';
import { MultasComponent } from './pages/multas/multas.component';
import { CrearMultaComponent } from './pages/crear-multa/crear-multa.component';
import { EditarMultaComponent } from './pages/editar-multa/editar-multa.component';
import { VerMultaComponent } from './pages/ver-multa/ver-multa.component';
import { LoginGuard } from './guards/login.guard';


export const ROUTES: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'logout', component: LogoutComponent, canActivate: [AuthGuard] },
  { path: 'persona', component: PersonaComponent },
  { path: 'persona/crear-persona', component: CrearPersonaComponent },
  { path: 'carne', component: CarneComponent },
  { path: 'carne/crear-carne', component: CrearCarneComponent },
  { path: 'certificado', component: CertificadoComponent },
  {
    path: 'certificado/crear-certificado',
    component: CrearCertificadoComponent,
  },
  { path: 'multas', component: MultasComponent, canActivate: [AuthGuard] },
  { path: 'multas/crear-multa', component: CrearMultaComponent, canActivate: [AuthGuard] },
  { path: 'multas/editar-multa/:id', component: EditarMultaComponent, canActivate: [AuthGuard] },
  { path: 'multas/ver-multa/:id', component: VerMultaComponent, canActivate: [AuthGuard] },
  { path: '', pathMatch: 'full', redirectTo: 'login' },
  { path: '**', pathMatch: 'full', redirectTo: 'login' },
];
