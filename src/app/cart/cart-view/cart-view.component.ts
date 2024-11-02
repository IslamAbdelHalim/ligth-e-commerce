import { Component } from '@angular/core';
import { CartService } from '../cart.service';
import { Product } from '../../models/product';

@Component({
  selector: 'app-cart-view',
  templateUrl: './cart-view.component.html',
  styleUrl: './cart-view.component.css'
})
export class CartViewComponent {
  products: Product[] = [];
  totalPrice: number = 0;
  totalProducts: number = 0;

  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    this.getProducts();
  }

  getProducts(): void {
    this.cartService.getCartItems().subscribe(data => {
      this.products = data;
      this.totalProducts = data.length;
      this.totalPrice = this.getTotalPrice();
    })
  }

  getTotalPrice(): number {
    return this.products.reduce((pre, curr) => pre + curr.price, 0);
  }

  clearCarts(): void {
    this.cartService.clearCart().subscribe();
    this.products = [];
    this.totalPrice = 0;
    this.totalProducts = 0;
  }

}
