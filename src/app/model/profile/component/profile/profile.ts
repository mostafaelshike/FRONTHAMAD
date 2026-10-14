import { isPlatformBrowser } from '@angular/common';
import { Component, HostListener, OnInit, PLATFORM_ID, signal, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { CartService } from '../../../../core/services/cart.service';
import { OrderService } from '../../../../core/services/order.service';
import { ToastService } from '../../../../core/services/toast.service';
import { WishlistService } from '../../../../core/services/wishlist.service';
import { Order, User } from '../../../../core/models/models';

@Component({
  selector: 'app-profile',
  standalone: false,
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile implements OnInit {
  private readonly platformId = inject(PLATFORM_ID);
  readonly orders = signal<Order[]>([]);
  readonly loadingOrders = signal(true);
  readonly editing = signal(false);
  readonly saving = signal(false);
  readonly selectedOrder = signal<Order | null>(null);
  showLogoutDialog = false;

  name = '';
  email = '';
  phone = '';
  organization = '';

  constructor(
    public authService: AuthService,
    public cartService: CartService,
    public wishlistService: WishlistService,
    private router: Router,
    private orderService: OrderService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login'], { queryParams: { returnUrl: '/profile' } });
      return;
    }

    this.populateForm(this.authService.currentUser());
    this.authService.getMe().subscribe({
      next: (res) => this.populateForm(res.data),
      error: () => this.populateForm(this.authService.currentUser())
    });

    this.orderService.getMyOrders().subscribe({
      next: (res) => {
        this.orders.set(res.success ? res.data || [] : []);
        this.loadingOrders.set(false);
      },
      error: () => this.loadingOrders.set(false)
    });
  }

  get initials(): string {
    return (this.authService.currentUser()?.name || 'مستخدم')
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part[0])
      .join('');
  }

  get roleLabel(): string {
    const labels: Record<User['role'], string> = {
      user: 'حساب شخصي',
      doctor: 'ممارس صحي',
      vendor: 'مورد طبي',
      admin: 'مدير النظام'
    };
    return labels[this.authService.currentUser()?.role || 'user'];
  }

  get activeOrders(): number {
    return this.orders().filter((order) => !['delivered', 'cancelled'].includes(order.orderStatus)).length;
  }

  startEditing(): void {
    this.populateForm(this.authService.currentUser());
    this.editing.set(true);
  }

  cancelEditing(): void {
    this.populateForm(this.authService.currentUser());
    this.editing.set(false);
  }

  openLogoutDialog(): void {
    this.showLogoutDialog = true;
  }

  cancelLogout(): void {
    this.showLogoutDialog = false;
  }

  confirmLogout(): void {
    this.showLogoutDialog = false;
    this.authService.logout();
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.showLogoutDialog) {
      this.cancelLogout();
      return;
    }

    if (this.selectedOrder()) {
      this.closeOrderDetails();
    }
  }

  openOrderDetails(order: Order): void {
    this.selectedOrder.set(order);
  }

  closeOrderDetails(): void {
    this.selectedOrder.set(null);
  }

  paymentLabel(method: Order['paymentMethod']): string {
    const labels: Record<Order['paymentMethod'], string> = {
      cash_on_delivery: 'الدفع عند الاستلام',
      credit_card: 'بطاقة ائتمانية',
      bank_transfer: 'تحويل بنكي',
      mada: 'مدى',
      tabby: 'تابي'
    };
    return labels[method] || method;
  }

  saveProfile(): void {
    const name = this.name.trim();
    const email = this.email.trim().toLowerCase();
    const phone = this.phone.trim();
    const organization = this.organization.trim();

    if (name.length < 2) {
      this.toastService.show('الاسم يجب أن يحتوي على حرفين على الأقل', 'info');
      return;
    }
    if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,3}$/i.test(email)) {
      this.toastService.show('يرجى إدخال بريد إلكتروني صحيح', 'info');
      return;
    }
    if (phone.length > 20 || organization.length > 100) {
      this.toastService.show('رقم الهاتف أو اسم المنشأة تجاوز الحد الأقصى المسموح', 'info');
      return;
    }
    if (this.saving()) {
      return;
    }

    this.saving.set(true);
    this.authService.updateProfile({
      name,
      email,
      phone,
      organization
    }).subscribe({
      next: (res) => {
        this.saving.set(false);
        this.populateForm(res.data);
        this.editing.set(false);
        this.toastService.show('تم تحديث بيانات حسابك بنجاح');
      },
      error: (err) => {
        this.saving.set(false);
        this.toastService.show(err.message || 'تعذر تحديث البيانات، حاول مرة أخرى', 'error');
      }
    });
  }

  statusLabel(status: Order['orderStatus']): string {
    const labels: Record<Order['orderStatus'], string> = {
      pending: 'قيد المراجعة',
      processing: 'قيد التجهيز',
      shipped: 'تم الشحن',
      delivered: 'تم التسليم',
      cancelled: 'ملغي'
    };
    return labels[status];
  }

  private populateForm(user: User | null | undefined): void {
    if (!user) return;
    this.name = user.name || '';
    this.email = user.email || '';
    this.phone = user.phone || '';
    this.organization = user.organization || '';
  }
}
