import { Component } from '@angular/core';
import { forkJoin } from 'rxjs';
import { WishlistService } from '../../../../core/services/wishlist.service';
import { CartService } from '../../../../core/services/cart.service';
import { ToastService } from '../../../../core/services/toast.service';
import { Product } from '../../../../core/models/models';

@Component({
  selector: 'app-favorite',
  standalone: false,
  templateUrl: './favorite.html',
  styleUrl: './favorite.css',
})
export class Favorite {
  selectedProduct: Product | null = null;
  selectedCategory = 'all';
  sortBy: 'default' | 'price-low' | 'price-high' = 'default';

  constructor(
    public wishlistService: WishlistService,
    private cartService: CartService,
    private toastService: ToastService
  ) {}

  get products(): any[] {
    return this.wishlistService.wishlistItems().map((p: any) => ({
      ...p,
      id: p._id || p.id,
      company: p.brandName || (typeof p.brand === 'object' ? p.brand?.name : p.brand) || 'شركة معتمدة',
      brand: p.brandName || (typeof p.brand === 'object' ? p.brand?.name : p.brand) || 'علامة تجارية',
      discount: p.badgePrice || (p.oldPrice && p.oldPrice > p.price ? Math.round(((p.oldPrice - p.price) / p.oldPrice) * 100) + '%' : ''),
      shipping: 'شحن سريع ومجاني',
      status: 'معتمد SFDA',
      rating: p.rating || 5,
      reviews: p.reviewsCount || 24,
      stockLabel: (p.stock || 0) > 0 ? 'متوفر في المستودع' : 'نفد من المخزون'
    }));
  }

  get categoryFilters(): Array<{ id: string; name: string }> {
    const categories = new Map<string, string>();

    for (const product of this.products) {
      const category = product.category;
      const id = typeof category === 'object' ? category?._id : category;
      const name = typeof category === 'object' ? category?.name : category;
      if (id && name) categories.set(String(id), String(name));
    }

    return Array.from(categories, ([id, name]) => ({ id, name }));
  }

  get filteredProducts(): any[] {
    const filtered = this.selectedCategory === 'all'
      ? [...this.products]
      : this.products.filter((product) => {
          const category = product.category;
          const id = typeof category === 'object' ? category?._id : category;
          return String(id) === this.selectedCategory;
        });

    if (this.sortBy === 'price-low') filtered.sort((a, b) => a.price - b.price);
    if (this.sortBy === 'price-high') filtered.sort((a, b) => b.price - a.price);
    return filtered;
  }

  countForCategory(categoryId: string): number {
    return this.products.filter((product) => {
      const category = product.category;
      const id = typeof category === 'object' ? category?._id : category;
      return String(id) === categoryId;
    }).length;
  }

  setSort(event: Event): void {
    this.sortBy = (event.target as HTMLSelectElement).value as typeof this.sortBy;
  }

  addToCart(product: Product): void {
    this.cartService.addToCart(product, 1).subscribe({
      next: (res) => {
        this.toastService.show(
          res.localOnly
            ? 'تمت الإضافة محليًا، لكن تعذرت مزامنة السلة مع الحساب'
            : `تمت إضافة "${product.name}" إلى سلة المشتريات`,
          res.localOnly ? 'info' : 'success'
        );
      },
      error: () => {
        this.toastService.show('تعذر إضافة المنتج إلى السلة، حاول مرة أخرى', 'error');
      }
    });
  }

  addAllToCart(): void {
    const products = this.filteredProducts;
    if (!products.length) return;

    forkJoin(products.map((product) => this.cartService.addToCart(product, 1))).subscribe({
      next: (results) => {
        const localOnly = results.some((result) => result.localOnly);
        this.toastService.show(
          localOnly
            ? `تمت إضافة ${products.length} منتجات محليًا، لكن تعذرت مزامنتها مع الحساب`
            : `تمت إضافة ${products.length} منتجات إلى السلة`,
          localOnly ? 'info' : 'success'
        );
      },
      error: () => this.toastService.show('تعذر إضافة بعض المنتجات إلى السلة', 'error')
    });
  }

  removeFavorite(product: Product): void {
    this.wishlistService.toggleWishlist(product).subscribe({
      next: () => {
        this.toastService.show(`تمت إزالة "${product.name}" من المفضلة`);
      },
      error: () => {
        this.toastService.show('تعذر تحديث المفضلة، حاول مرة أخرى', 'error');
      }
    });
  }

  removeFromWishlist(product: Product): void {
    this.removeFavorite(product);
  }

  openProduct(product: Product): void {
    this.selectedProduct = product;
  }
}