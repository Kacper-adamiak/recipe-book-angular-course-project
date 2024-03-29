import {Component, OnInit} from '@angular/core';

import {Recipe} from '../recipe.model';
import {ShoppingListService} from "../../shopping-list/shopping-list.service";
import {ActivatedRoute, Router} from "@angular/router";
import {RecipesService} from "../recipes.service";

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.css']
})
export class RecipeDetailComponent implements OnInit {
  recipe: Recipe;

  constructor(private shoppingListService: ShoppingListService,
              private route: ActivatedRoute,
              private recipesService: RecipesService,
              private router: Router) {
  }

  ngOnInit() {
    this.route.params.subscribe(
      params => this.recipe = this.recipesService.recipes.find(item => item.id === Number.parseInt(params['id']))
    )
  }

  addIngredientsToShoppingList() {
    this.shoppingListService.upsertIngredients(this.recipe.ingredients)
  }

  deleteRecipe() {
    this.recipesService.deleteRecipe(this.recipe.id)
    this.router.navigate(['/recipes'])
  }

}
