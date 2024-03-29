import {CanActivateFn, Router, UrlTree} from '@angular/router';
import {inject} from "@angular/core";
import {AuthService} from "./auth.service";
import {map} from "rxjs/operators";
import {Observable} from "rxjs";

export const authGuard: CanActivateFn = (route, state): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> => {

  const authService = inject(AuthService)
  const router = inject(Router)

  return authService.$user.pipe(
    map(user => !!user ? true : router.createUrlTree(['/auth'])),
  )
};
