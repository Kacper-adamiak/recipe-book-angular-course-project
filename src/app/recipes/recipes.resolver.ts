import {ResolveFn} from '@angular/router';
import {inject} from "@angular/core";
import {RecipesService} from "./recipes.service";
import {Recipe} from "./recipe.model";

export const recipesResolver: ResolveFn<Recipe[]> = (route, state) => {
  let recipeService = inject(RecipesService)
  if (recipeService.recipes.length > 0) return recipeService.recipes
  return recipeService.fetchDataFromHttp()
};
