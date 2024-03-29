import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {catchError, tap} from "rxjs/operators";
import {BehaviorSubject, throwError} from "rxjs";
import {User} from "./user.model";
import {Router} from "@angular/router";
import {UrlService} from "../shared/url.service";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  $user = new BehaviorSubject<User>(null)
  private logoutTimer: number

  constructor(private http: HttpClient, private router: Router, private urlService: UrlService) {
  }

  signup(email: string, password: string) {
    return this.http.post<AuthResponse>(this.urlService.signUpUrl,
      {
        email: email,
        password: password,
        returnSecureToken: true
      })
      .pipe(
        catchError(this.handleErrorResponse)
      )
  }

  signin(email: string, password: string) {
    return this.http.post<AuthResponse>(this.urlService.signInUrl,
      {
        email: email,
        password: password,
        returnSecureToken: true
      })
      .pipe(
        catchError(this.handleErrorResponse),
        tap(
          data => {
            this.handleAuthentication(
              data.email,
              data.localId,
              data.idToken,
              data.expiresIn
            )
          }
        )
      )

  }

  logout() {
    this.$user.next(null)
    this.router.navigate(['/auth'])
    localStorage.removeItem('userData')
    if (this.logoutTimer) {
      clearTimeout(this.logoutTimer)
    }
  }

  private handleAuthentication(email: string, userId: string, token: string, expiresIn: string) {
    this.$user.next(
      new User(
        email,
        userId,
        token,
        new Date(new Date().getTime() + Number.parseInt(expiresIn) * 1000)
      )
    )
    localStorage.setItem('userData', JSON.stringify(this.$user.value))
    this.autoLogout(Number.parseInt(expiresIn) * 1000)
  }

  autoSignin() {
    const userData: {
      id: string,
      email: string,
      _token: string,
      _tokenExpirationDate: string
    } = JSON.parse(localStorage.getItem('userData'))
    if (!userData) return
    console.log(userData)

    const newUser = new User(
      userData.email,
      userData.id,
      userData._token,
      new Date(userData._tokenExpirationDate)
    )

    if (newUser.token) {
      this.$user.next(newUser)
      const expirationDuration = new Date(userData._tokenExpirationDate).getTime() - new Date().getTime()
      this.autoLogout(expirationDuration)
    }
  }

  autoLogout(expirationDuration: number) {
    this.logoutTimer = setTimeout(() => {
      this.logout()
    }, expirationDuration)
  }

  private handleErrorResponse(err: HttpErrorResponse) {
    let newError = 'An unknown error occurred!'
    if (!err.error || !err.error.error) return throwError(newError)
    switch (err.error.error.message) {
      case 'EMAIL_NOT_FOUND':
        newError = 'This email does not exist!'
        break
      case 'INVALID_PASSWORD':
        newError = 'This password is not correct!'
        break
      case 'USER_DISABLED':
        newError = 'This user is disabled!'
        break
      case 'EMAIL_EXISTS':
        newError = 'This email already exists!'
        break
      case 'INVALID_LOGIN_CREDENTIALS':
        newError = 'Invalid login credentials!'
        break

    }
    return throwError(newError)
  }

  redirectToAuth() {
    this.router.navigate(['/auth'])
  }
}

export interface AuthResponse {
  idToken: string
  email: string
  refreshToken: string
  expiresIn: string
  localId: string
  registered?: boolean
}
