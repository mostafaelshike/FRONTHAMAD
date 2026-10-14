import { CommonModule } from '@angular/common';
import { Component, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { CartService } from '../../core/services/cart.service';
import { ToastService } from '../../core/services/toast.service';
import { WishlistService } from '../../core/services/wishlist.service';
import { Product } from '../../core/models/models';

@Component({
  selector: 'app-product-details-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-details-modal.html',
  styleUrl: './product-details-modal.css'
})
export class ProductDetailsModal {
  @Input() product: Product | null = null;
  @Output() closed = new EventEmitter<void>();

  quantity = 1;
  busy = false;

  constructor(
    private cartService: CartService,
    public wishlistService: WishlistService,
    private toastService: ToastService
  ) {}

  get brandName(): string {
    const brand = this.product?.brand;
    return this.product?.brandName || (typeof brand === 'object' ? brand?.name : brand) || 'علامة تجارية معتمدة';
  }

  get categoryName(): string {
    const category = this.product?.category;
    return this.product?.categoryName || (typeof category === 'object' ? category?.name : category) || 'مستلزمات طبية';
  }

  get discountPercent(): number {
    const product = this.product;
    if (!product?.oldPrice || product.oldPrice <= product.price) return 0;
    return Math.round(((product.oldPrice - product.price) / product.oldPrice) * 100);
  }

  decreaseQuantity(): void {
    this.quantity = Math.max(1, this.quantity - 1);
  }

  increaseQuantity(): void {
    this.quantity++;
  }

  addToCart(): void {
    if (!this.product || this.busy || this.product.stock <= 0) return;

    this.busy = true;
    this.cartService.addToCart(this.product, this.quantity).subscribe({
      next: (res) => {
        this.busy = false;
        this.toastService.show(
          res.localOnly
            ? 'تمت الإضافة محليًا، لكن تعذرت مزامنة السلة مع الحساب'
            : `تمت إضافة "${this.product?.name}" إلى السلة`,
          res.localOnly ? 'info' : 'success'
        );
      },
      error: () => {
        this.busy = false;
        this.toastService.show('تعذر إضافة المنتج إلى السلة، حاول مرة أخرى', 'error');
      }
    });
  }

  toggleFavorite(): void {
    if (!this.product || this.busy) return;

    const wasFavorite = this.wishlistService.isFavorite(this.product._id || this.product.id || '');
    this.busy = true;
    this.wishlistService.toggleWishlist(this.product).subscribe({
      next: () => {
        this.busy = false;
        this.toastService.show(wasFavorite ? 'تمت إزالة المنتج من المفضلة' : 'تمت إضافة المنتج إلى المفضلة');
      },
      error: () => {
        this.busy = false;
        this.toastService.show('تعذر تحديث المفضلة، حاول مرة أخرى', 'error');
      }
    });
  }

  onBackdropClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) this.closed.emit();
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.product) this.closed.emit();
  }
}