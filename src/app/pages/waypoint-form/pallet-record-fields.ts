import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormArray, FormGroup } from '@angular/forms';
import { PalletType } from '../../pallet-type';

@Component({
	selector: 'pallet-record-fields',
	templateUrl: 'pallet-record-fields.html'
})
export class PalletRecordFields {

	@Input('parentFormGroup')
	public parentFormGroup: FormGroup;

	@Input('palletTypes')
	public palletTypes: PalletType[];

	constructor(private formBuilder: FormBuilder) {}
	
	ngOnInit(): void {

		// add formarray
		debugger;
		this.parentFormGroup.addControl('pallet_records_attributes', this.formBuilder.array(
			this.palletTypes.map(
				(pt) => this.formBuilder.group({
					pallet_type_id: [pt.id],
					picked_up: [''],
					dropped_off: [''],
					damaged: ['']
				})
			)
		))	
	}
}
