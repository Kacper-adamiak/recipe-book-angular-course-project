import {Injectable} from '@angular/core';
import {Recipe} from "./recipe.model";
import {BehaviorSubject} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {map, tap} from "rxjs/operators";
import {AuthService} from "../auth/auth.service";
import {UrlService} from "../shared/url.service";

@Injectable({
  providedIn: 'root'
})
export class RecipesService {

  // private _recipes: Recipe[] = [
  //   new Recipe(1,
  //     'A Test Recipe',
  //     'This is simply a test',
  //     'https://upload.wikimedia.org/wikipedia/commons/1/15/Recipe_logo.jpeg',
  //     [new Ingredient("Bread", 2), new Ingredient("Tomato", 10)]
  //   ),
  //   new Recipe(2,
  //     'Another Test Recipe',
  //     'This is simply a test',
  //     'https://upload.wikimedia.org/wikipedia/commons/1/15/Recipe_logo.jpeg',
  //     [new Ingredient("Bun", 2),new Ingredient("Tomato", 2)]
  //   )
  // ];

  private _recipes: Recipe[]

  selectedRecipeEvent = new BehaviorSubject<Recipe[]>([])

  constructor(private http: HttpClient,
              private authService: AuthService,
              private urlService: UrlService) {
    this._recipes = []
  }


  get recipes(): Recipe[] {
    return this._recipes;
  }

  upsertRecipe(recipe: Recipe) {

    if (!recipe.ingredients) recipe.ingredients = []

    let index = this._recipes.findIndex(r => r.id === recipe.id)
    if (index === -1) {
      this._recipes.push(recipe)
    } else {
      this._recipes[index] = recipe
    }
    this.selectedRecipeEvent.next(this._recipes)
  }

  deleteRecipe(id: number) {
    let index = this._recipes.findIndex(r => r.id === id)
    this._recipes.splice(index, 1)
    this.selectedRecipeEvent.next(this._recipes)
  }

  fetchDataFromHttp() {
    return this.http.get<Recipe[]>(this.urlService.recipesUrl)
      .pipe(
        map(
          recipes => {
            return recipes.map(recipe => {
              return {...recipe, ingredients: !recipe.ingredients ? [] : recipe.ingredients}
            })
          }
        ),
        tap(
          data => {
            this._recipes = data
            this.selectedRecipeEvent.next(data)
            console.log(data)
          }
        )
      )
  }

  saveDataToHttp() {
    this.http.put(this.urlService.recipesUrl, this._recipes).subscribe()
  }
}
