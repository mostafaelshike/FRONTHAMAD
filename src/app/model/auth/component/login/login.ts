import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';
import { ToastService } from '../../../../core/services/toast.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.html',
  styleUrl: './login.css',
  standalone: false
})
export class Login {
  email = '';
  password = '';
  showPassword = false;
  rememberMe = true;
  loading = false;
  errorMessage = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private toastService: ToastService
  ) {}

  toggleShowPassword(): void {
    this.showPassword = !this.showPassword;
  }

  onLogin(): void {
    this.email = this.email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email) || this.email.length > 120) {
      this.errorMessage = 'يرجى إدخال بريد إلكتروني صحيح';
      return;
    }
    if (!this.password || this.password.length > 64) {
      this.errorMessage = 'يرجى إدخال كلمة مرور لا تتجاوز 64 حرفاً';
      return;
    }
    if (this.loading) {
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    this.authService.login({ email: this.email, password: this.password }).subscribe({
      next: (res) => {
        this.loading = false;
        if (res.success) {
          this.toastService.show('تم تسجيل الدخول بنجاح');
          const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
          this.router.navigateByUrl(returnUrl);
        }
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = err.fieldErrors?.map((item: { message: string }) => item.message).join('، ') ||
          err.message ||
          'فشل تسجيل الدخول، يرجى التأكد من صحة البريد وكلمة المرور';
        this.toastService.show(this.errorMessage, 'error');
      }
    });
  }
}