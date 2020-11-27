import { EMPTY, Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { catchError, map } from 'rxjs/operators';
import { APP_CONFIG } from 'src/app/helpers/app.config';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Time } from 'src/app/helpers/consumables_enum';

@Injectable({
  providedIn: 'root'
})
export class StarShipFormService {

  constructor(
    private http: HttpClient,
    private snackBar: MatSnackBar
  ) { }

  readStarShips(page): Observable<any> {
    const options: any = {}
    options.params = new HttpParams()
      .set('page', page.toString())
    options.headers = new HttpHeaders()

    const url = `${APP_CONFIG.API_SERVER}starships`

    return this.http.get<any>(url, options).pipe(
      map((obj) => obj),
      catchError((e) => this.errorHandler(e))
    );
  }

  /**
   * Com base na entrada do usuário calcular paradas durante a viagem.
   * Informações obtidas da nave:
   * @param this.formStarShip.value.MGLT
   * @param this.formStarShip.value.consumables
   * Informação de distância inserida pelo usuário:
   * @param this.formStarShip.value.distance
   * 
   * Fórmula referência: distanceMGLT / starShip.MGLT * (starShipConsumables * horas)
   */
  stopsStarShip(starShip) {
    let index = starShip.consumables.split(/(\d+)/).filter(Boolean)
    const [value, key] = index
    let starShipHoursConsumables = Time[key.trim()]

    let hoursConsumables = parseInt(value) * parseInt(starShipHoursConsumables)
    let starShipConsumables = parseInt(starShip.MGLT) * hoursConsumables

    return (starShip.distance / starShipConsumables).toFixed(0)
  }

  showMessage(message: string, isError: boolean = false) {
    this.snackBar.open(message, '', {
      duration: 5000,
      panelClass: isError ? ['msg-error'] : ['msg-success']
    });
  }

  // Message error
  errorHandler(e: any): Observable<any> {
    this.showMessage(e.error.message, true)
    return EMPTY // Return empty object
  }
}
