import { Injectable, signal, computed } from '@angular/core';
import { Observable, of, tap } from 'rxjs';
import { ApiService } from './api.service';
import { AuthService } from './auth.service';
import { ApiResponse, Product } from '../models/models';

@Injectable({
  providedIn: 'root'
})
export class WishlistService {
  wishlistItems = signal<Product[]>([]);

  wishlistCount = computed(() => this.wishlistItems().length);

  constructor(private api: ApiService, private authService: AuthService) {
    this.loadWishlist();
  }

  private loadWishlist(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      const saved = localStorage.getItem('local_wishlist');
      if (saved) {
        try {
          this.wishlistItems.set(JSON.parse(saved));
        } catch (e) {
          this.wishlistItems.set([]);
        }
      }
    }

    if (this.authService.isAuthenticated()) {
      this.fetchRemoteWishlist().subscribe();
    }
  }

  private saveToStorage(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem('local_wishlist', JSON.stringify(this.wishlistItems()));
    }
  }

  fetchRemoteWishlist(): Observable<ApiResponse<Product[]>> {
    return this.api.get<ApiResponse<Product[]>>('wishlist').pipe(
      tap((res) => {
        if (res.success && res.data) {
          this.wishlistItems.set(res.data);
          this.saveToStorage();
        }
      })
    );
  }

  toggleWishlist(product: Product): Observable<any> {
    const current = [...this.wishlistItems()];
    const index = current.findIndex(
      (item) => (item._id || item.id) === (product._id || product.id)
    );

    if (index > -1) {
      current.splice(index, 1);
    } else {
      current.push(product);
    }

    this.wishlistItems.set(current);
    this.saveToStorage();

    if (this.authService.isAuthenticated()) {
      return this.api.post('wishlist/toggle', { productId: product._id || product.id });
    }
    return of({ success: true, isAdded: index === -1 });
  }

  isFavorite(productId: string | number): boolean {
    return this.wishlistItems().some(
      (item) => (item._id || item.id) === productId
    );
  }
}
