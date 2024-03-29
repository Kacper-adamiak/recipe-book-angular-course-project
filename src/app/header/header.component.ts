import {Component, OnDestroy, OnInit} from '@angular/core';
import {RecipesService} from "../recipes/recipes.service";
import {AuthService} from "../auth/auth.service";
import {Subscription} from "rxjs";
import {User} from "../auth/user.model";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html'
})
export class HeaderComponent implements OnInit, OnDestroy {

  private userSubscription: Subscription
  isAuthenticated: boolean = false
  user: User = null

  constructor(private recipesService: RecipesService,
              private authService: AuthService) {
  }

  ngOnInit() {
    this.userSubscription = this.authService.$user.subscribe(user => {
      this.isAuthenticated = !!user
      this.user = user
    })
  }

  ngOnDestroy() {
    this.userSubscription.unsubscribe()
  }

  fetchData() {
    this.recipesService.fetchDataFromHttp().subscribe()
  }

  saveData() {
    this.recipesService.saveDataToHttp()
  }

  onLogout() {
    this.authService.logout()
  }
}
