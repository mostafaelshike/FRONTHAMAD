import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../../../../core/services/auth.service';
import { CartService } from '../../../../core/services/cart.service';
import { WishlistService } from '../../../../core/services/wishlist.service';
import { CategoryService } from '../../../../core/services/category.service';
import { Category } from '../../../../core/models/models';

@Component({
selector: 'app-navbar',
standalone: false,
templateUrl: './navbar.html',
styleUrl: './navbar.css'
})
export class Navbar implements OnInit {

isSidebarOpen: boolean = false;

searchQuery: string = '';
categories: Category[] = [];

constructor(
public authService: AuthService,
public cartService: CartService,
public wishlistService: WishlistService,
private categoryService: CategoryService,
private router: Router
) {}

ngOnInit(): void {
this.categoryService.getCategories().subscribe({
  next: (res) => {
    if (res.success && res.data) this.categories = res.data;
  },
  error: (err) => console.error('Error loading search categories:', err)
});
}

toggleSidebar(): void {
this.isSidebarOpen = !this.isSidebarOpen;
}

closeSidebar(): void {
this.isSidebarOpen = false;
}

onSearch(): void {


const keyword = this.searchQuery.trim();

this.router.navigate(
  ['/product'],
  {
    queryParams: {
      keyword: keyword || null,
      brand: null
    }
  }
);

this.closeSidebar();

}

logout(): void {
this.authService.logout();
}

@HostListener('document:keydown.escape')
onEscape(): void {
this.closeSidebar();
}
}
