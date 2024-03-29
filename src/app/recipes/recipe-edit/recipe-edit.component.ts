import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {Recipe} from "../recipe.model";
import {RecipesService} from "../recipes.service";
import {FormArray, FormControl, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-recipe-edit',
  templateUrl: './recipe-edit.component.html',
  styleUrl: './recipe-edit.component.css'
})
export class RecipeEditComponent implements OnInit {
  recipe: Recipe
  form: FormGroup
  editMode: boolean;

  constructor(private route: ActivatedRoute,
              private recipesService: RecipesService) {
  }

  ngOnInit(): void {

    this.form = new FormGroup({
      name: new FormControl(null, [Validators.required]),
      description: new FormControl(null, [Validators.required]),
      imagePath: new FormControl(null, [Validators.required]),
      ingredients: new FormArray([])
    })

    this.route.params.subscribe(
      params => {
        let id = params['id']
        if (id) {
          this.recipe = this.recipesService.recipes.find(recipe => recipe.id === Number.parseInt(id))
          this.form.patchValue(this.recipe)
          this.recipe.ingredients.forEach(ingredient => {
            this.addIngredient(ingredient.name, ingredient.amount)
          })
          this.editMode = true
        } else {
          this.editMode = false
          this.recipe = new Recipe(null, '', '', '', [])
        }
      })
  }

  addIngredient(name: string = '', amount: number = null) {
    (<FormArray>this.form.get('ingredients')).push(new FormGroup({
      name: new FormControl(name, [Validators.required]),
      amount: new FormControl(amount, [Validators.required])
    }))
  }

  deleteIngredient(index: number) {
    (<FormArray>this.form.get('ingredients')).removeAt(index)
  }

  getIngredientsControls() {
    return (this.form.get('ingredients') as FormArray).controls
  }

  onSubmit() {
    let recipe = {
      id: this.recipe.id ? this.recipe.id : this.recipesService.recipes.length + 1,
      ...this.form.value
    }
    this.recipesService.upsertRecipe(recipe)
  }
}
