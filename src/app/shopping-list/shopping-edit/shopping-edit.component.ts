import {Component, OnDestroy, OnInit} from '@angular/core';

import {Ingredient} from '../../shared/ingredient.model';
import {ShoppingListService} from "../shopping-list.service";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css']
})
export class ShoppingEditComponent implements OnInit, OnDestroy {

  subscriptions: Subscription[] = []

  form: FormGroup = new FormGroup({
    name: new FormControl(null, Validators.required),
    amount: new FormControl(null, Validators.required)
  })

  constructor(private shoppingListService: ShoppingListService) {
  }

  ngOnInit() {
    this.subscriptions.push(this.shoppingListService.chosenIngredientIndex.subscribe(index => {
      if (index !== -1) {
        const ingredient = this.shoppingListService.getIngredient(index)
        this.form.patchValue({
          name: ingredient.name,
          amount: ingredient.amount
        })
        this.form.markAsDirty()
      }
    }))
  }

  onDelete() {
    this.shoppingListService.deleteIngredient()
    this.onClear()
  }

  onClear() {
    this.form.reset()
    this.shoppingListService.chosenIngredientIndex.next(-1)
  }

  onAddItem() {
    const newIngredient = new Ingredient(this.form.value.name, this.form.value.amount);
    this.shoppingListService.upsertIngredient(newIngredient)
  }

  onUpdateItem() {
    const newIngredient = new Ingredient(this.form.value.name, this.form.value.amount);
    console.log(newIngredient)
    console.log(this.shoppingListService.chosenIngredientIndex.value)
    console.log(this.shoppingListService.ingredients)
    this.shoppingListService.updateIngredient(newIngredient)
    this.onClear()
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe())
  }

}
