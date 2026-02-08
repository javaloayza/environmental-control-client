import { Injectable, inject } from '@angular/core';
import type { HttpErrorResponse } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import type { Observable } from 'rxjs';
import { catchError, map, throwError } from 'rxjs';
import { environment } from '@environments/environment';
import type { ApiResponse } from '@core/models';
import { NotificationService } from './notification.service';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private http = inject(HttpClient);
  private baseUrl = environment.apiUrl;
  private notificationService = inject(NotificationService);

  // ⚠️ Global error handler
  private handleError = (error: HttpErrorResponse) => {
    let message = 'Unknown error occurred';
    if (error.error instanceof ErrorEvent) {
      message = `Client error: ${error.error.message}`;
    } else if (error.error?.message) {
      message = error.error.message;
    } else {
      message = `Server error: ${error.status}`;
    }
    console.error('API Error =>', error);
    this.notificationService.error(message);
    return throwError(() => new Error(message));
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getData<T>(endpoint: string, body?: any): Observable<T> {
    return this.http.post<ApiResponse<T>>(`${this.baseUrl}/${endpoint}`, body ?? {}, { withCredentials: true })
      .pipe(
        map(res => {
          if (!res.success) throw new Error(res.message || 'Failed to fetch data');
          return res.data;
        }),
        catchError(this.handleError),
      );
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  postData<T>(endpoint: string, body: any): Observable<T> {
    return this.http.post<ApiResponse<T>>(`${this.baseUrl}/${endpoint}`, body, { withCredentials: true })
      .pipe(
        map(res => {
          if (!res.success) throw new Error(res.message || 'Failed to post data');
          return res.data;
        }),
        catchError(this.handleError),
      );
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  postFilesWithData<T>(endpoint: string, data: Record<string, any>, files: File[]): Observable<T> {
    const formData = new FormData();

    // Append JSON data
    for (const [key, value] of Object.entries(data)) {
      formData.append(key, value);
    }

    // Append files
    let i = 0;
    for (const file of files) {
      formData.append(`file${i}`, file, file.name);
      i++;
    }

    return this.http.post<ApiResponse<T>>(`${this.baseUrl}/${endpoint}`, formData, { withCredentials: true }).pipe(
      map(res => {
        if (!res.success) throw new Error(res.message || 'Failed to upload files');
        return res.data;
      }),
      catchError(this.handleError),
    );
}

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  downloadFile(endpoint: string, body?: any, fileName?: string): Observable<void> {
    return this.http.post(`${this.baseUrl}/${endpoint}`, body ?? {}, {
      responseType: 'blob',
      withCredentials: true
    }).pipe(
      map((blob: Blob) => {
        const url = globalThis.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName ?? 'download';
        a.click();
        globalThis.URL.revokeObjectURL(url);
      }),
      catchError(this.handleError),
    );
  }
}
