import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { ApiResponse, ContactMessage } from '../models/models';

@Injectable({
  providedIn: 'root'
})
export class ContactService {
  constructor(private api: ApiService) {}

  submitContact(data: {
    name: string;
    email: string;
    phone?: string;
    subject: string;
    message: string;
  }): Observable<ApiResponse<ContactMessage>> {
    return this.api.post<ApiResponse<ContactMessage>>('contact', data);
  }

  getContacts(params?: any): Observable<ApiResponse<ContactMessage[]>> {
    return this.api.get<ApiResponse<ContactMessage[]>>('contact', params);
  }

  updateContact(id: string, data: any): Observable<ApiResponse<ContactMessage>> {
    return this.api.put<ApiResponse<ContactMessage>>(`contact/${id}`, data);
  }

  deleteContact(id: string): Observable<ApiResponse<any>> {
    return this.api.delete<ApiResponse<any>>(`contact/${id}`);
  }
}
