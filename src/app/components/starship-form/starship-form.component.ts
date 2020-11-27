import { Component, OnInit, ViewChild } from '@angular/core';
import { Time } from 'src/app/helpers/consumables_enum';
import { StarShipFormService } from './starship-form.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSelect } from '@angular/material/select';

@Component({
  selector: 'app-starship-form',
  templateUrl: './starship-form.component.html',
  styleUrls: ['./starship-form.component.scss']
})
export class StarShipFormComponent implements OnInit {
  page = 1;
  starShips;
  starShipSelected: any;
  formStarShip: FormGroup;
  @ViewChild('starShipSelect') selectElem: MatSelect;

  constructor(
    private startShipService: StarShipFormService,
    private _formBuilder: FormBuilder) { }

  ngOnInit(): void {
    this.formCreate()
    this.loadStarShips()
  }

  loadStarShips() {
    this.startShipService.readStarShips(this.page).subscribe(response => {
      !this.starShips
        ? this.starShips = response.results
        : this.starShips = this.starShips.concat(response.results)

      /**
       * PONTO DE MELHORIA: Inserir paginação na tag select similar ao infinityscroll.
       * Referência para melhoria => this.selectElem._elementRef.nativeElement.addEventListener('onscroll', () => this.loadStarShips())
       */
      this.page++
      if (response.results.length >= 10) this.selectElem._elementRef.nativeElement.onscroll = this.loadStarShips()
    }, error => { console.log(error) })
  }

  stops() {
    this.formStarShip.patchValue({
      stops: this.startShipService.stopsStarShip(this.formStarShip.value),
      time: (this.formStarShip.value.distance / parseInt(this.formStarShip.value.MGLT)).toFixed(2)
    });
  }

  submit() {
    if (this.formStarShip.valid && this.starShipSelected.MGLT !== 'unknown') { this.stops() }
    else
      this.startShipService.showMessage(`Informações imcompletas da nave.`, true)
  }

  formCreate() {
    this.formStarShip = this._formBuilder.group({
      name: this._formBuilder.control({ value: '', disabled: false, }, Validators.compose([Validators.required])),
      model: this._formBuilder.control({ value: '', disabled: false }),
      passengers: this._formBuilder.control({ value: '', disabled: false }),
      MGLT: this._formBuilder.control({ value: '', disabled: false }),
      distance: this._formBuilder.control({ value: '', disabled: false }, Validators.compose([Validators.required])),
      time: this._formBuilder.control({ value: '', disabled: false }),
      stops: this._formBuilder.control({ value: '', disabled: false }),
      consumables: this._formBuilder.control({ value: '', disabled: false }),
    });
  }

  setSelectedValues(event) {
    this.starShipSelected = event
    this.formStarShip.patchValue({
      model: this.starShipSelected.model,
      passengers: this.starShipSelected.passengers,
      MGLT: this.starShipSelected.MGLT,
      consumables: this.starShipSelected.consumables
    });
  }
}
