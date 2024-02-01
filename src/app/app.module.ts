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
import { TopbarComponent } from './components/topbar/topbar.component';
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
import { PersonaComponent } from './pages/persona/persona.component';
import { CrearPersonaComponent } from './pages/crear-persona/crear-persona.component';
import { CarneComponent } from './pages/carne/carne.component';
import { CrearCarneComponent } from './pages/crear-carne/crear-carne.component';
import { ImageCropperModule } from 'ngx-image-cropper';
import { CertificadoComponent } from './pages/certificado/certificado.component';
import { CrearCertificadoComponent } from './pages/crear-certificado/crear-certificado.component';
import { ModalcarneComponent } from './components/modalcarne/modalcarne.component';
import { ModalcertificadoComponent } from './components/modalcertificado/modalcertificado.component';
import { TypeaheadModule } from "ngx-bootstrap/typeahead";
import { MultasComponent } from './pages/multas/multas.component';
import { CrearMultaComponent } from './pages/crear-multa/crear-multa.component';
import { EditarMultaComponent } from './pages/editar-multa/editar-multa.component';
import { ListarAdministradoComponent } from './components/listar-administrado/listar-administrado.component';
import { ListarDescripcionComponent } from './components/listar-descripcion/listar-descripcion.component';
import { ListarReferenciaComponent } from './components/listar-referencia/listar-referencia.component';
import { CrearAdministradoComponent } from './components/crear-administrado/crear-administrado.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    MenuComponent,
    DashboardComponent,
    NavbarComponent,
    FooterComponent,
    TopbarComponent,
    LogoutComponent,
    ToastComponent,
    PersonaComponent,
    CrearPersonaComponent,
    CarneComponent,
    CrearCarneComponent,
    CertificadoComponent,
    CrearCertificadoComponent,
    ModalcarneComponent,
    ModalcertificadoComponent,
    MultasComponent,
    CrearMultaComponent,
    EditarMultaComponent,
    ListarAdministradoComponent,
    ListarDescripcionComponent,
    ListarReferenciaComponent,
    CrearAdministradoComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    NgxDropzoneModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    NgSelectModule,
    ImageCropperModule,
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
    TooltipModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
