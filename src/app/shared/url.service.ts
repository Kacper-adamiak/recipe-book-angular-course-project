import {Injectable} from '@angular/core';
import {enviroment} from '../../enviroments/enviroment';

@Injectable({
  providedIn: 'root'
})
export class UrlService {
  signUpUrl = `${enviroment.firebase.authUrl}:signUp?key=${enviroment.firebase.apiKey}`
  signInUrl = `${enviroment.firebase.authUrl}:signInWithPassword?key=${enviroment.firebase.apiKey}`
  recipesUrl = `${enviroment.firebase.databaseUrl}/recipes.json`

  constructor() {
  }
}
