import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router, ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {
    currentUrl: string = '';
    constructor(private router: Router, private route: ActivatedRoute) { }

    async canActivate(next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Promise<boolean> {
        const url: string = state.url;
        // this.currentUrl = this.route.snapshot.url.join('/');
        console.log(url);
        // let token = localStorage.getItem('session-dashboard');
        // if (token) {
        return true;
        // } else {
        //     this.router.navigateByUrl('/login');
        //     return false;
        // }

        // let token = await this.authService.getToken();
        // let token = sessionStorage.getItem('token');

        // if(token){
        //   return this.authService.postJwtValidate().then(
        //     async (result: any) => {
        //       if(result.error == 0){
        //         return true;
        //       }else{
        //         Swal.fire({
        //           text: result.message,
        //           heightAuto: false,
        //           background: '#1A191D',
        //           color: '##FFFFFF',
        //           confirmButtonColor: '#EA535A'
        //         });

        //         this.authService.setToken(null);
        //         this.authService.isAuthenticated.next(false);
        //         this.router.navigateByUrl('/nav/login');

        //         return false; 
        //       }
        //     },
        //     async (error) => {
        //       this.authService.setToken(null);
        //       this.authService.isAuthenticated.next(false);
        //       this.router.navigateByUrl('/nav/login');

        //       return false;
        //     }
        //   );
        // }else{
        //   this.authService.setToken(null);
        //   this.authService.isAuthenticated.next(false);
        //   this.router.navigateByUrl('/nav/login');

        //   return false;
        // }
    }
}