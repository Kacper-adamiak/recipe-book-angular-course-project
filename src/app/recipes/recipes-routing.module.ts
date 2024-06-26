import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {RecipesComponent} from "./recipes.component";
import {authGuard} from "../auth/auth.guard";
import {RecipePlaceholderComponent} from "./recipe-placeholder/recipe-placeholder.component";
import {RecipeEditComponent} from "./recipe-edit/recipe-edit.component";
import {RecipeDetailComponent} from "./recipe-detail/recipe-detail.component";
import {recipesResolver} from "./recipes.resolver";

const routes: Routes = [
  {
    path: '',
    component: RecipesComponent,
    canActivate: [authGuard],
    children: [
      {
        path: '',
        component: RecipePlaceholderComponent
      },
      {
        path: 'new',
        component: RecipeEditComponent
      },
      {
        path: ':id',
        component: RecipeDetailComponent,
        resolve: [recipesResolver]
      },
      {
        path: ':id/edit',
        component: RecipeEditComponent,
        resolve: [recipesResolver]
      },
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RecipesRoutingModule {
}
