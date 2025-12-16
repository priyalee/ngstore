import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from '../services/product.service';
import { SharedService } from '../services/shared.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  products: any[] = [];
  filteredProducts: any[] = [];

  constructor(
    private productService: ProductService,
    private sharedService: SharedService
  ) {}

  ngOnInit(): void {
    this.loadProducts();

    //  Listen for category selection from Navbar
    this.sharedService.categorySelected$.subscribe(category => {
      this.applyCategoryFilter(category);
    });
  }

  //  Load all products
  loadProducts(): void {
    this.productService.getAll().subscribe({
      next: (data) => {
        this.products = data;
        this.filteredProducts = data;
      },
      error: (err) => console.error('Error loading products:', err)
    });
  }

  // Filter products by category
  private applyCategoryFilter(category: string): void {
    this.filteredProducts =
      category === 'all' || !category
        ? this.products
        : this.products.filter(
            p =>
              p.category?.toLowerCase().trim() ===
              category.toLowerCase().trim()
          );
  }

  //  Add a new product
  addProduct(): void {
    const newProduct = {
      title: 'New Demo Product',
      price: 49.99,
      description: 'A test product added for demo.',
      image: 'https://picsum.photos/200',
      category: 'electronics'
    };

    this.productService.add(newProduct).subscribe({
      next: () => {
        console.log('✅ Product added successfully!');
        this.loadProducts();
      },
      error: (err) => console.error('Error adding product:', err)
    });
  }

  //  Update an existing product
  updateProduct(id: number): void {
    const updatedData = { title: 'Updated Product Title' };

    this.productService.update(id, updatedData).subscribe({
      next: () => {
        console.log('✏️ Product updated successfully!');
        this.loadProducts();
      },
      error: (err) => console.error('Error updating product:', err)
    });
  }

  //  Delete a product
  deleteProduct(id: number): void {
    this.productService.delete(id).subscribe({
      next: () => {
        console.log('🗑️ Product deleted successfully!');
        this.loadProducts();
      },
      error: (err) => console.error('Error deleting product:', err)
    });
  }

  addNum(a:number,b:number){
    return a+b;
  }
}
