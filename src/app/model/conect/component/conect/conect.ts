import { Component } from '@angular/core';

@Component({
  selector: 'app-conect',
  standalone: false,
  templateUrl: './conect.html',
  styleUrl: './conect.css',
})
export class Conect {

  selectedFileName = '';
  attachmentError = '';
  formError = '';

  onFileSelected(event: Event): void {
    const input = event.target;
    if (!(input instanceof HTMLInputElement)) {
      console.error('Unable to read the selected contact attachment.');
      return;
    }

    const file = input.files?.[0];
    this.attachmentError = '';

    if (!file) {
      this.selectedFileName = '';
      return;
    }

    if (file.size > 20 * 1024 * 1024) {
      this.selectedFileName = '';
      this.attachmentError = 'حجم الملف أكبر من 20 ميجابايت';
      input.value = '';
      return;
    }

    this.selectedFileName = file.name;
  }

  sendMessage(event: Event): void {
    event.preventDefault();
    this.formError = '';

    const form = event.currentTarget;
    if (!(form instanceof HTMLFormElement)) {
      console.error('Unable to read the contact form submission.');
      return;
    }

    const formData = new FormData(form);
    const fullName = String(formData.get('fullName') ?? '').trim();
    const email = String(formData.get('email') ?? '').trim();
    const phone = String(formData.get('phone') ?? '').trim();
    const inquiryType = String(formData.get('inquiryType') ?? '').trim();
    const message = String(formData.get('message') ?? '').trim();

    if (fullName.length < 2 || fullName.length > 80) {
      this.formError = 'الاسم يجب أن يكون بين حرفين و80 حرفاً';
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 120) {
      this.formError = 'يرجى إدخال بريد إلكتروني صحيح';
      return;
    }
    if (!inquiryType || phone.length > 20 || message.length < 5 || message.length > 500) {
      this.formError = 'تحقق من تصنيف الاستفسار ورقم الهاتف وطول الرسالة (من 5 إلى 500 حرف)';
      return;
    }

    const whatsappMessage = [
      'رسالة جديدة من صفحة تواصل معنا - سوق طبي',
      `الاسم: ${fullName}`,
      `البريد الإلكتروني: ${email}`,
      `رقم الهاتف: ${phone || 'غير مضاف'}`,
      `نوع الاستفسار: ${inquiryType}`,
      `تفاصيل الرسالة: ${message}`,
      ...(this.selectedFileName
        ? [
            `الملف المحدد: ${this.selectedFileName}`,
            'يرجى إرفاق الملف يدويًا في محادثة واتساب.',
          ]
        : []),
    ].join('\n');

    const whatsappUrl = `https://wa.me/201120892274?text=${encodeURIComponent(whatsappMessage)}`;
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  }

}
