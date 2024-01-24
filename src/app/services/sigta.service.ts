import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map, firstValueFrom } from 'rxjs';
import { HttpClientUtils } from '../utils/http-client.utils';
import { catchError } from 'rxjs/operators';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class SigtaService {
  constructor(private httpClientUtils: HttpClientUtils) { }

  listarAreaOficina(data: any) {
    return this.httpClientUtils
      .postQuery('sigta/areaoficina/listar', data)
      .pipe(
        map((data) => {
          return data;
        })
      );
  }
  
  listarMedidaComp(data: any) {
    return this.httpClientUtils.postQuery('sigta/medidacomp/listar', data).pipe(
      map((data) => {
        return data;
      })
    );
  }

  busContribuyente(data: any) {
    return this.httpClientUtils
      .postQuery('sigta/contribuyente/listar', data)
      .pipe(
        map((data) => {
          return data;
        })
      );
  }

  buscarMulta(data: any) {
    return this.httpClientUtils.postQuery('sigta/multa/listar', data).pipe(
      map((data) => {
        return data;
      })
    );
  }

  obtenerNombrePorCod(data: any) {
    return this.httpClientUtils
      .postQuery('sigta/contribuyente-nombre/listar', data)
      .pipe(
        catchError((error: any) => {
          // Manejo del error aquí
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Something went wrong!',
            footer: '<a href="#">Why do I have this issue?</a>',
          });
          console.log(error);

          // Puedes reenviar el error para que lo maneje el componente si es necesario
          throw error;
        })
      );
  }

  obtenerDescripcionPorCod(data: any) {
    return this.httpClientUtils
      .postQuery('sigta/descripcion/listar', data)
      .pipe(
        map((data) => {
          return data;
        })
      );
  }

  consultarMulta(data: any) {
    return this.httpClientUtils
      .postQuery('sigta/consultarMulta/listar', data)
      .pipe(
        map((data) => {
          return data;
        })
      );
  }
  registrarInfraccion(data: any) {
    return this.httpClientUtils
      .postQuery('sigta/infraccion/registrar', data)
      .pipe(
        map((data) => {
          return data;
        })
      );
  }

























  listarPropietario(data: any) {
    return this.httpClientUtils.postQuery('sanidad/propietariosel', data).pipe(
      map((data) => {
        return data;
      })
    );
  }

  guardarRecurrente(data: any) {
    return this.httpClientUtils
      .postQuery('sanidad/recurrente/registrar', data)
      .pipe(
        map((data) => {
          return data;
        })
      );
  }

  guardarPropietario(data: any) {
    return this.httpClientUtils.postQuery('sanidad/propietarioreg', data).pipe(
      map((data) => {
        return data;
      })
    );
  }

  listarOcupacion(data: any) {
    return this.httpClientUtils
      .postQuery('sanidad/ocupacion/listar', data)
      .pipe(
        map((data) => {
          return data;
        })
      );
  }

  listarGiro(data: any) {
    return this.httpClientUtils
      .postQuery('sanidad/actividad/listar', data)
      .pipe(
        map((data) => {
          return data;
        })
      );
  }

  ListarCertificado(data: any) {
    return this.httpClientUtils
      .postQuery('sanidad/certificado/listar', data)
      .pipe(
        map((data) => {
          return data;
        })
      );
  }

  listarRubro(data: any) {
    return this.httpClientUtils
      .postQuery('sanidad/actividad/listar', data)
      .pipe(
        map((data) => {
          return data;
        })
      );
  }

  listarEstablecimiento(data: any) {
    return this.httpClientUtils
      .postQuery('sanidad/establecimiento/listar', data)
      .pipe(
        map((data) => {
          return data;
        })
      );
  }

  listarCarne(data: any) {
    return this.httpClientUtils.postQuery('sanidad/carne/listar', data).pipe(
      map((data) => {
        return data;
      })
    );
  }

  guardarCarne(data: any) {
    return this.httpClientUtils.postQuery('sanidad/carne/guardar', data).pipe(
      map((data) => {
        return data;
      })
    );
  }

  guardarCertificado(data: any) {
    return this.httpClientUtils
      .postQuery('sanidad/certificado/guardar', data)
      .pipe(
        map((data) => {
          return data;
        })
      );
  }

  //EXTRAS
  DeImagenURLaBase64(data: any) {
    return this.httpClientUtils
      .postQuery('sanidad/deimagenurlabase64', data)
      .pipe(
        map((data) => {
          return data;
        })
      );
  }

  //MASCOTAS

  animalreg(data: any) {
    return this.httpClientUtils.postQuery('sanidad/animalreg', data).pipe(
      map((data) => {
        return data;
      })
    );
  }

  animalsel(data: any) {
    return this.httpClientUtils.postQuery('sanidad/animalsel', data).pipe(
      map((data) => {
        return data;
      })
    );
  }

  especieselec(data: any) {
    return this.httpClientUtils.postQuery('sigta/especieselec', data).pipe(
      map((data) => {
        return data;
      })
    );
  }

  animalsexosel(data: any) {
    return this.httpClientUtils.postQuery('sanidad/animalsexosel', data).pipe(
      map((data) => {
        return data;
      })
    );
  }

  especierazasel(data: any) {
    return this.httpClientUtils.postQuery('sanidad/especierazasel', data).pipe(
      map((data) => {
        return data;
      })
    );
  }
  BuscarRecibo(data: any) {
    return this.httpClientUtils.postQuery('sanidad/apirecibosel', data).pipe(
      map((data) => {
        return data;
      })
    );
  }

  AnularCarnet(data: any) {
    return this.httpClientUtils.postQuery('sanidad/AnularCarnet', data).pipe(
      map((data) => {
        return data;
      })
    );
  }

  ListarAnimalPropietario(data: any) {
    return this.httpClientUtils
      .postQuery('sanidad/ListarAnimalPropietario', data)
      .pipe(
        map((data) => {
          return data;
        })
      );
  }

  GuardarAnimalPropietario(data: any) {
    return this.httpClientUtils
      .postQuery('sanidad/animalpropietarioreg', data)
      .pipe(
        map((data) => {
          return data;
        })
      );
  }

  AnularCertificado(data: any) {
    return this.httpClientUtils
      .postQuery('sanidad/AnularCertificado', data)
      .pipe(
        map((data) => {
          return data;
        })
      );
  }

  SendCorreoCarnet(data: any) {
    return this.httpClientUtils
      .postQuery('sanidad/ProcesoEnvioCorreoCarnet', data)
      .pipe(
        map((data) => {
          return data;
        })
      );
  }

  SendCorreoCertificado(data: any) {
    return this.httpClientUtils
      .postQuery('sanidad/ProcesoEnvioCorreoCertificado', data)
      .pipe(
        map((data) => {
          return data;
        })
      );
  }
}
