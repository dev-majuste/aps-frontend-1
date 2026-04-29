import { Injectable, NgZone } from '@angular/core';
import { AuthService } from './auth-service';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SseService {
  private readonly API = `${environment.apiUrl}/fluxo`; //URL do endpoitn

  constructor(private _zone: NgZone, private auth: AuthService) {}

  public conectar(): Observable<any> {
    const usuario = this.auth.getUsuario();

    return new Observable(observer => {
      const eventSource = new EventSource(`${this.API}/subscribe/${usuario.id}`)

      eventSource.addEventListener('notificacao', (event: any) => {
        this._zone.run(() => {
          const dados = JSON.parse(event.data);
          observer.next(dados);
        });
      });

      eventSource.onerror = error => this._zone.run(() => observer.error(error));
      return () => eventSource.close();
    });
  }
}
