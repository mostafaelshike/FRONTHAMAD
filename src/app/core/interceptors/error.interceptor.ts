import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ToastService } from '../services/toast.service';

/**
 * Global Error Interceptor — Website (Front)
 *
 * Handles:
 *  • HTTP 429  → rate-limit toast
 *  • HTTP 409  → conflict toast
 *  • HTTP 422  → attaches structured field errors (.fieldErrors[]) to the
 *                thrown error object so forms can display inline errors
 *  • HTTP 401  → session-expired toast
 */
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const toast = inject(ToastService);
  const router = inject(Router);

  return next(req).pipe(
    catchError((err: HttpErrorResponse) => {
      const body = err.error ?? {};

      switch (err.status) {
        case 429:
          toast.show(
            body.message || 'تم تجاوز الحد الأقصى للطلبات، يرجى المحاولة بعد قليل',
            'error'
          );
          break;

        case 409:
          toast.show(
            body.message || 'يوجد تعارض في الطلب، يرجى التحقق والمحاولة مجدداً',
            'error'
          );
          break;

        case 401:
          if (!/\/auth\/(login|register)(?:\?|$)/.test(req.urlWithParams)) {
            if (typeof window !== 'undefined') {
              localStorage.removeItem('token');
              localStorage.removeItem('user');
              window.dispatchEvent(new Event('medical-market:session-expired'));
            }
            toast.show('انتهت صلاحية جلستك، يرجى تسجيل الدخول مجدداً', 'info');
            void router.navigate(['/login'], {
              queryParams: { returnUrl: router.url }
            });
          }
          break;

        default:
          break;
      }

      // Attach fieldErrors for 422 so form components can read them
      const fallbackMessage = err.status === 0
        ? 'تعذر الاتصال بالخادم، تحقق من اتصال الإنترنت وحاول مرة أخرى'
        : 'حدث خطأ في الخادم';
      const enhanced: any = new Error(body.message || fallbackMessage);
      enhanced.status = err.status;
      enhanced.error = body;

      if (err.status === 422 && Array.isArray(body.errors)) {
        enhanced.fieldErrors = body.errors as Array<{ field: string; message: string }>;
      }

      return throwError(() => enhanced);
    })
  );
};
