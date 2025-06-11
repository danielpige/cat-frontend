import { HttpEvent, HttpHandler, HttpInterceptor, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { TokenKeys } from '../enums/tokenKey.enum';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private readonly API_URL = environment.apiUrl;

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = localStorage.getItem(TokenKeys.AUTH_TOKEN);

    const isApiRequest = request.url.startsWith(this.API_URL);

    if (token && isApiRequest) {
      const authReq = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      });
      return next.handle(authReq);
    }

    return next.handle(request);
  }
}
