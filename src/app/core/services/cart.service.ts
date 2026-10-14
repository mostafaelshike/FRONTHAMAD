import { Injectable, signal, computed } from '@angular/core';
import { Observable, catchError, of, tap } from 'rxjs';
import { ApiService } from './api.service';
import { AuthService } from './auth.service';
import { ApiResponse, CartItem, Product } from '../models/models';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  cartItems = signal<CartItem[]>([]);

  itemCount = computed(() => {
    return this.cartItems().reduce((acc, item) => acc + item.quantity, 0);
  });

  subtotal = computed(() => {
    return this.cartItems().reduce((acc, item) => acc + (item.product.price || 0) * item.quantity, 0);
  });

  tax = computed(() => {
    return Math.round(this.subtotal() * 0.15 * 100) / 100;
  });

  shippingFee = computed(() => {
    if (this.subtotal() >= 500 || this.cartItems().length === 0) return 0;
    return 35;
  });

  total = computed(() => {
    return Math.round((this.subtotal() + this.tax() + this.shippingFee()) * 100) / 100;
  });

  constructor(private api: ApiService, private authService: AuthService) {
    this.loadCart();
  }

  private loadCart(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      const saved = localStorage.getItem('local_cart');
      if (saved) {
        try {
          this.cartItems.set(JSON.parse(saved));
        } catch (e) {
          this.cartItems.set([]);
        }
      }
    }

    if (this.authService.isAuthenticated()) {
      this.fetchRemoteCart().subscribe();
    }
  }

  private saveToStorage(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem('local_cart', JSON.stringify(this.cartItems()));
    }
  }

  fetchRemoteCart(): Observable<ApiResponse<any>> {
    return this.api.get<ApiResponse<any>>('cart').pipe(
      tap((res) => {
        if (res.success && res.data?.items) {
          const formatted: CartItem[] = res.data.items.map((i: any) => ({
            product: i.product,
            quantity: i.quantity
          }));
          this.cartItems.set(formatted);
          this.saveToStorage();
        }
      })
    );
  }

  addToCart(product: Product, quantity: number = 1): Observable<any> {
    const current = [...this.cartItems()];
    const existingIndex = current.findIndex(
      (item) => (item.product._id || item.product.id) === (product._id || product.id)
    );

    if (existingIndex > -1) {
      current[existingIndex].quantity += quantity;
    } else {
      current.push({ product, quantity });
    }

    this.cartItems.set(current);
    this.saveToStorage();

    if (this.authService.isAuthenticated()) {
      return this.api.post('cart', { productId: product._id || product.id, quantity }).pipe(
        catchError((error: Error) => of({
          success: true,
          localOnly: true,
          message: error.message
        }))
      );
    }
    return of({ success: true });
  }

  updateQuantity(productId: string | number, quantity: number): Observable<any> {
    let current = [...this.cartItems()];
    const index = current.findIndex(
      (item) => (item.product._id || item.product.id) === productId
    );

    if (index > -1) {
      if (quantity <= 0) {
        current.splice(index, 1);
      } else {
        current[index].quantity = quantity;
      }
      this.cartItems.set(current);
      this.saveToStorage();

      if (this.authService.isAuthenticated()) {
        return this.api.put(`cart/${productId}`, { quantity });
      }
    }
    return of({ success: true });
  }

  removeFromCart(productId: string | number): Observable<any> {
    let current = this.cartItems().filter(
      (item) => (item.product._id || item.product.id) !== productId
    );
    this.cartItems.set(current);
    this.saveToStorage();

    if (this.authService.isAuthenticated()) {
      return this.api.delete(`cart/${productId}`);
    }
    return of({ success: true });
  }

  clearCart(): Observable<any> {
    this.cartItems.set([]);
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.removeItem('local_cart');
    }

    if (this.authService.isAuthenticated()) {
      return this.api.delete('cart');
    }
    return of({ success: true });
  }
}
