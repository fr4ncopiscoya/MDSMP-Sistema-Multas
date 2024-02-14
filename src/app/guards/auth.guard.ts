import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import Swal from 'sweetalert2';

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {

    constructor(private authService: AuthService, private router: Router) { }

    async canActivate(): Promise<boolean> {
        let token = localStorage.getItem('session-dashboard');
        if (token) {
            return true;
        } else {
            this.router.navigateByUrl('/login');
            return false;
 }
}
}
