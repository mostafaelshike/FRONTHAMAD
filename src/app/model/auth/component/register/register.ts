import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { ToastService } from '../../../../core/services/toast.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.html',
  styleUrl: './register.css',
  standalone: false
})
export class Register {
  name = '';
  email = '';
  password = '';
  confirmPassword = '';
  phone = '';
  organization = '';
  role = 'user';
  loading = false;
  errorMessage = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastService: ToastService
  ) {}

  submit(): void {
    this.name = this.name.trim();
    this.email = this.email.trim().toLowerCase();
    this.phone = this.phone.trim();
    this.organization = this.organization.trim();

    if (this.name.length < 2 || this.name.length > 80) {
      this.errorMessage = 'الاسم يجب أن يكون بين حرفين و80 حرفاً';
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email) || this.email.length > 120) {
      this.errorMessage = 'يرجى إدخال بريد إلكتروني صحيح لا يتجاوز 120 حرفاً';
      return;
    }

    if (this.password.length < 6 || this.password.length > 64) {
      this.errorMessage = 'كلمة المرور يجب أن تكون بين 6 و64 حرفاً';
      return;
    }

    if (this.phone.length > 20 || this.organization.length > 100) {
      this.errorMessage = 'رقم الهاتف أو اسم المنشأة تجاوز الحد الأقصى المسموح';
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'كلمة المرور وتأكيدها غير متطابقين';
      return;
    }

    if (this.loading) return;
    this.loading = true;
    this.errorMessage = '';

    this.authService.register({
      name: this.name,
      email: this.email,
      password: this.password,
      phone: this.phone,
      organization: this.organization,
      role: this.role
    }).subscribe({
      next: (res) => {
        this.loading = false;
        if (res.success) {
          this.toastService.show('تم إنشاء الحساب بنجاح، مرحباً بك في سوق طبي');
          this.router.navigate(['/']);
        }
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = err.fieldErrors?.map((item: { message: string }) => item.message).join('، ') ||
          err.message ||
          'حدث خطأ أثناء إنشاء الحساب، يرجى المحاولة لاحقاً';
        this.toastService.show(this.errorMessage, 'error');
      }
    });
  }
}