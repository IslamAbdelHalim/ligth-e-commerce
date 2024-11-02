import { Component, Host } from '@angular/core';
import {BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ProductService } from '../product.service';
import { Product } from '../../models/product';
import { CartService } from '../../cart/cart.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css'
})
export class ProductListComponent {

  products: Product[] = [];
  filteredProducts: Product[] = [];
  sortOrder: string = '';
  items: number = 6

  constructor(
    private productService: ProductService,
    private breakPointObserver: BreakpointObserver,
    private cartService: CartService,
    private snackbar: MatSnackBar) {}

  ngOnInit(): void {
    this.getProducts();
    this.setupResponsive();
  }

  getProducts(): void {
    this.productService.getProducts().subscribe((data) => {
      this.products = data;
      this.filteredProducts = data;
    }, (err) => {
      console.log(err)
    })
  }

  addToCart(product: Product) {
    this.cartService.addToCart(product).subscribe({
      next: () => {
        this.snackbar.open('new product added successfully', '', {
          duration: 2000,
          verticalPosition: 'top',
          horizontalPosition: 'right'
        })
      }
    })
  }

  applyFilter(event: Event): void {
    let searchItem = (event.target as HTMLInputElement).value.toLowerCase();

    this.filteredProducts = this.products.filter(product => product.name.toLowerCase().includes(searchItem))

    this.applySort(this.sortOrder);
  }

  applySort(value: string): void{
    this.sortOrder = value;

    if (this.sortOrder === 'priceLowHigh') {
      this.filteredProducts.sort((a,b) => a.price - b.price);
    } else if (this.sortOrder === 'priceHighLow') {
      this.filteredProducts.sort((a,b) => b.price - a.price);
    }
  }

  setupResponsive(): void {
    this.breakPointObserver.observe([Breakpoints.XSmall, Breakpoints.Small, Breakpoints.Medium]).subscribe(result => {
      if (result.breakpoints[Breakpoints.XSmall]) {
        this.items = 2
      } else if (result.breakpoints[Breakpoints.Small]) {
        this.items = 3
      } else if (result.breakpoints[Breakpoints.Medium]) {
        this.items = 4
      } else {
        this.items = 6
      }
    })
  }
}
