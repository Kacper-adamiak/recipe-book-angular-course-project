import {Component, OnDestroy, ViewChild} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {AuthResponse, AuthService} from "./auth.service";
import {Observable, Subscription} from "rxjs";
import {Router} from '@angular/router';
import {AlertComponent} from "../shared/alert/alert.component";
import {AlertDirective} from "../shared/alert/alert.directive";

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.css'
})
export class AuthComponent implements OnDestroy {
  isLogin: boolean = false
  isLoading: boolean = false
  error: string = null
  form: FormGroup = new FormGroup({
    email: new FormControl(null, [Validators.required, Validators.email]),
    password: new FormControl(null, [Validators.required, Validators.minLength(6)])
  })
  private alertCloseSubscription: Subscription

  @ViewChild(AlertDirective) alertRef: AlertDirective

  constructor(private auth: AuthService,
              private router: Router) {
  }

  onSwitchMode() {
    this.isLogin = !this.isLogin
  }

  onSubmit() {
    if (this.form.invalid) return
    console.log(this.form.value)
    const email = this.form.value['email']
    const password = this.form.value['password']
    this.isLoading = true

    let $auth: Observable<AuthResponse>

    if (this.isLogin) {
      $auth = this.auth.signin(email, password)
    } else {
      $auth = this.auth.signup(email, password)
    }

    $auth.subscribe({
      next: data => {
        console.log(data)
        this.isLoading = false
        if (this.isLogin) this.router.navigate(['/recipes'])
      },
      error: err => {
        console.log(err)
        this.error = err
        this.isLoading = false
        this.showErrorAlert(err)
      },
      complete: () => {
      }
    })

    this.form.reset()
  }

  private showErrorAlert(message: string) {
    this.alertRef.viewConeainerRef.clear()
    const componentRef = this.alertRef.viewConeainerRef.createComponent(AlertComponent)
    componentRef.instance.message = message
    this.alertCloseSubscription = componentRef.instance.close.subscribe(
      () => {
        this.alertCloseSubscription.unsubscribe()
        this.alertRef.viewConeainerRef.clear()
      }
    )
  }

  ngOnDestroy() {
    if (this.alertCloseSubscription) {
      this.alertCloseSubscription.unsubscribe()
    }
  }
}

