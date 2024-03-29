import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {inject} from "@angular/core";
import {AuthService} from './auth.service';
import {Observable} from 'rxjs';

export class AuthInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    let reqCopy = req
    const authService = inject(AuthService)
    if (authService.$user.value) {
      reqCopy = req.clone({
        params: req.params.append('auth', authService.$user.value.token)
      })
    }
    return next.handle(reqCopy)
  }
}
