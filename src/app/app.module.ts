import { NgModule, Injectable, NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { LoginComponent } from './pages/login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ROUTES } from './app.routes';
import { Socket } from 'ngx-socket-io';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { MenuComponent } from './components/menu/menu.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { FooterComponent } from './components/footer/footer.component';
import { LogoutComponent } from './pages/logout/logout.component';
import { ToastComponent } from './components/toast/toast.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxSpinnerModule } from "ngx-spinner";
import { DataTablesModule } from "angular-datatables";
import { DataTableDirective } from 'angular-datatables';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { ModalModule } from "ngx-bootstrap/modal";
import { TreeviewModule } from 'ngx-treeview';
import { TypeaheadModule } from "ngx-bootstrap/typeahead";
import { MultasComponent } from './pages/multas/multas.component';
import { CrearMultaComponent } from './pages/crear-multa/crear-multa.component';
import { EditarMultaComponent } from './pages/editar-multa/editar-multa.component';
import { ListarAdministradoComponent } from './components/listar-administrado/listar-administrado.component';
import { ListarDescripcionComponent } from './components/listar-descripcion/listar-descripcion.component';
import { ListarReferenciaComponent } from './components/listar-referencia/listar-referencia.component';
import { CrearAdministradoComponent } from './components/crear-administrado/crear-administrado.component';
import { VerMultaComponent } from './pages/ver-multa/ver-multa.component';
import { LoginGuard } from './guards/login.guard';
import { VerResolucionComponent } from './components/ver-resolucion/ver-resolucion.component';
import { CrearInformeFinalComponent } from './components/crear-informe-final/crear-informe-final.component';
import { AnularResolucionComponent } from './components/anular-resolucion/anular-resolucion.component';
import { AnularMultaComponent } from './components/anular-multa/anular-multa.component';
import { CuentacorrienteComponent } from './pages/cuentacorriente/cuentacorriente.component';
import { CoactivoComponent } from './pages/coactivo/coactivo.component';
import { CoactivoCrearComponent } from './pages/coactivo-crear/coactivo-crear.component';
import { CoactivoVerComponent } from './pages/coactivo-ver/coactivo-ver.component';
import { CosgasComponent } from './pages/cosgas/cosgas.component';
import { CosgasModalComponent } from './components/cosgas-modal/cosgas-modal.component';
import { CrearReferenciaComponent } from './components/crear-referencia/crear-referencia.component';
import { CrearReferenciaMultaComponent } from './components/crear-referencia-multa/crear-referencia-multa.component';
import { ListarReferenciaMultaComponent } from './components/listar-referencia-multa/listar-referencia-multa.component';
import { ListarRefereComponent } from './components/listar-refere/listar-refere.component';
import { CrearRefereComponent } from './components/crear-refere/crear-refere.component';
import { CleaveDirective } from '../cleave.directive';
import { InputMaskModule } from '@ngneat/input-mask';
import { PersonasComponent } from './pages/personas/personas.component';
import { EditarAdministradoComponent } from './components/editar-administrado/editar-administrado.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    MenuComponent,
    DashboardComponent,
    NavbarComponent,
    FooterComponent,
    LogoutComponent,
    ToastComponent,
    MultasComponent,
    CrearMultaComponent,
    EditarMultaComponent,
    ListarAdministradoComponent,
    ListarDescripcionComponent,
    ListarReferenciaComponent,
    CrearAdministradoComponent,
    VerMultaComponent,
    VerResolucionComponent,
    CrearInformeFinalComponent,
    AnularResolucionComponent,
    AnularMultaComponent,
    CuentacorrienteComponent,
    CoactivoComponent,
    CoactivoCrearComponent,
    CoactivoVerComponent,
    CosgasComponent,
    CosgasModalComponent,
    CrearReferenciaComponent,
    CrearReferenciaMultaComponent,
    ListarReferenciaMultaComponent,
    ListarRefereComponent,
    CrearRefereComponent,
    CleaveDirective,
    PersonasComponent,
    EditarAdministradoComponent,
  ],
  imports: [
    InputMaskModule.forRoot({ inputSelector: 'input', isAsync: true }),
    BrowserModule,
    HttpClientModule,
    FormsModule,
    NgxDropzoneModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    NgSelectModule,
    BrowserAnimationsModule,
    NgxSpinnerModule,
    DataTablesModule,
    TooltipModule.forRoot(),
    TypeaheadModule.forRoot(),
    ModalModule.forRoot(),
    TreeviewModule.forRoot(),
    RouterModule.forRoot(ROUTES),
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA,
    NO_ERRORS_SCHEMA
  ],
  providers: [
    ToastComponent,
    DataTableDirective,
    TooltipModule,
    LoginGuard,
    LoginComponent,
    // ListarRefereComponent,
    ListarReferenciaComponent
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
