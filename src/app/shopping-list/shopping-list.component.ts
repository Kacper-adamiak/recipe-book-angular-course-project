import {Component, OnDestroy, OnInit} from '@angular/core';

import {Ingredient} from '../shared/ingredient.model';
import {ShoppingListService} from "./shopping-list.service";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css']
})
export class ShoppingListComponent implements OnInit, OnDestroy {

  ingredients: Ingredient[]
  private igSubscription: Subscription

  constructor(private shoppingListService: ShoppingListService) {
  }

  ngOnInit() {
    this.igSubscription = this.shoppingListService.ingredients.subscribe(
      ingredients => this.ingredients = ingredients
    )
  }

  onChoseIngredient(index: number) {
    this.shoppingListService.chosenIngredientIndex.next(index)
  }

  ngOnDestroy() {
    this.igSubscription.unsubscribe()
  }
}
