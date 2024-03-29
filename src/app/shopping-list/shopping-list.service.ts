import {Injectable} from '@angular/core';
import {Ingredient} from "../shared/ingredient.model";
import {BehaviorSubject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ShoppingListService {

  private _ingredients: Ingredient[] = [
    new Ingredient('Apples', 5),
    new Ingredient('Tomatoes', 10),
  ];

  ingredients: BehaviorSubject<Ingredient[]> = new BehaviorSubject<Ingredient[]>(this._ingredients)
  chosenIngredientIndex: BehaviorSubject<number> = new BehaviorSubject<number>(-1)

  constructor() {
  }

  getIngredient(index: number) {
    return this._ingredients[index]
  }

  addIngredient(ingredient: Ingredient) {
    this._ingredients.push(ingredient);
    this.ingredients.next(this._ingredients.slice())
  }

  addIngredients(ingredients: Ingredient[]) {
    // this._ingredients = this._ingredients.concat(ingredients)
    this._ingredients.push(...ingredients)
    this.ingredients.next(this._ingredients.slice())
  }

  deleteIngredient() {
    const index = this.chosenIngredientIndex.value
    this._ingredients.splice(index, 1)
    this.ingredients.next(this._ingredients.slice())
  }

  updateIngredient(ingredient: Ingredient) {
    this._ingredients[this.chosenIngredientIndex.value] = ingredient
    this.ingredients.next(this._ingredients.slice())
  }

  upsertIngredient(ingredient: Ingredient) {
    const index = this._ingredients.findIndex(ing => ing.name === ingredient.name)
    if (index === -1) {
      this.addIngredient(ingredient)
    } else {
      this._ingredients[index].amount += ingredient.amount
      this.ingredients.next(this._ingredients.slice())
    }
  }

  upsertIngredients(ingredients: Ingredient[]) {
    ingredients.forEach(ing => this.upsertIngredient(ing))
  }
}
