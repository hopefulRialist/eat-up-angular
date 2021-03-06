import { Component, Inject, Input } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { SocialUser } from "angularx-social-login";
import { AuthService } from "angularx-social-login";
import { FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { Shop, Consumables, BrandedConsumables } from 'src/app/shops/shops.model';
import { ShopsService } from 'src/app/shops/shops.service';

export interface DialogData {
  foodGroup: FoodGroup[];
  foodGroupControl: FormControl;
  addFoodFormGroup: FormGroup;
}

export interface FoodGroupAndCategory {
  group: string;
  type: string;
  isBranded?: boolean;
}

export interface AddedMenu extends FoodGroupAndCategory {
  name: string;
  price: number;
  amount: string;
}

export interface Category {
  value: FoodGroupAndCategory;
  viewValue: string;
}

export interface FoodGroup {
  disabled?: boolean;
  name: string;
  category: Category[];
}

export const FoodBeveragesMapping: {
  [key: string]: FoodGroupAndCategory
} = {
  meals: {
    group: 'Food',
    type: 'Meals'
  },
  brandedFood: {
    group: 'Food',
    type: 'Branded'
  },
  streetFoods: {
    group: 'Food',
    type: 'StreetFoods'
  },
  sweets: {
    group: 'Food',
    type: 'Sweets'
  },
  sandwiches: {
    group: 'Food',
    type: 'Sandwiches'
  },
  meryenda: {
    group: 'Food',
    type: 'Meryenda'
  },
  pastaNoodles: {
    group: 'Food',
    type: 'PastaNoodles'
  },
  brandedBeverage: {
    group: 'Beverages',
    type: 'Branded',
    isBranded: true
  },
  inHouseBeverage: {
    group: 'Beverages',
    type: 'InHouse'
  }
}

/**
 * @title Dialog Overview
 */
@Component({
  selector: 'app-add-menu-item',
  templateUrl: 'add-menu-item.component.html',
  styleUrls: ['add-menu-item.component.css'],
})
export class AddMenuItemComponent {
  @Input() shop: Shop;
  foodGroupControl = new FormControl();
  addFoodFormGroup: FormGroup;
  foodGroups: FoodGroup[] = [
    {
      name: 'Food',
      category: [
        { value: FoodBeveragesMapping.meals, viewValue: 'Meals' },
        { value: FoodBeveragesMapping.meryenda, viewValue: 'Meryenda' },
        { value: FoodBeveragesMapping.sandwiches, viewValue: 'Sandwiches' },
        { value: FoodBeveragesMapping.pastaNoodles, viewValue: 'Pasta/Noodles' },
        { value: FoodBeveragesMapping.sweets, viewValue: 'Sweets' },
        { value: FoodBeveragesMapping.streetFoods, viewValue: 'Street Foods' },
        { value: FoodBeveragesMapping.brandedFood, viewValue: 'Branded Foods' }
      ]
    },
    {
      name: 'Beverages',
      category: [
        { value: FoodBeveragesMapping.inHouseBeverage, viewValue: 'In-House' },
        { value: FoodBeveragesMapping.brandedBeverage, viewValue: 'Branded Beverages '}
      ]
    }
  ];

  public user: SocialUser;
  public loggedIn: boolean;

  constructor(
    private formBuilder: FormBuilder,
    public dialog: MatDialog,
    private authService: AuthService,
    private shopService: ShopsService) {}

  ngOnInit () {
    this.authService.authState.subscribe((user) => {
      this.user = user;
      this.loggedIn = (user != null);
    });
    this.addFoodFormGroup = this.formBuilder.group({
      foodCategoryAndType: new FormControl(),
      name: new FormControl(),
      price: new FormControl(),
      amount: new FormControl()
    })
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(AddMenuItemDialog, {
      width: '350px',
      data: {
        foodGroups: this.foodGroups,
        foodGroupControl: this.foodGroupControl,
        addFoodFormGroup: this.addFoodFormGroup,
      }
    });

    dialogRef.afterClosed().subscribe((result: AddedMenu) => {
      if (result.group && result.type) {
        const newMenu: Consumables | BrandedConsumables = {
          c_name: result.name,
          price: result.price,
          c_avg_rating: 0,
          amount: result.amount,
        };
        this.shop[result.group][result.type].push(newMenu);

        this.shopService.addFoodOrBeverageByShopId(this.shop.fe_id, result);
      }
    });
  }

  alertUser() {
    window.alert("Please sign-in with your UP Mail to use this feature.");
  }
}

@Component({
  selector: 'add-menu-item-dialog',
  templateUrl: 'add-menu-item-dialog.html',
})
export class AddMenuItemDialog {
  size = 12;
  width1 = 250;
  width2 = 100;
  height = 100;

  constructor(
    public dialogRef: MatDialogRef<AddMenuItemDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {
    }

  onNoClick(): void {
    this.dialogRef.close();
  }


  getAddedMenu(): AddedMenu {
    const addFoodFormGroup = this.data.addFoodFormGroup;
    const foodCategoryAndType = addFoodFormGroup.get('foodCategoryAndType').value;

    return {
      group: foodCategoryAndType ? foodCategoryAndType.group : null,
      type: foodCategoryAndType ? foodCategoryAndType.type : null,
      name: addFoodFormGroup.get('name').value,
      price: addFoodFormGroup.get('price').value,
      amount: foodCategoryAndType ? 
        foodCategoryAndType.isBranded ? addFoodFormGroup.get('amount').value : undefined
        : undefined
    }
  }

  isBranded(): boolean {
    const addFoodFormGroup = this.data.addFoodFormGroup;
    const foodCategoryAndType = addFoodFormGroup.get('foodCategoryAndType').value;

    return foodCategoryAndType ? foodCategoryAndType.isBranded : false
  }
}


/**  Copyright 2018 Google Inc. All Rights Reserved.
    Use of this source code is governed by an MIT-style license that
    can be found in the LICENSE file at http://angular.io/license */