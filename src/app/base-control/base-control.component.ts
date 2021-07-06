import { Directive, OnDestroy, OnInit } from "@angular/core";
import { AbstractControl, ControlValueAccessor, FormGroupDirective, NgControl } from "@angular/forms";

import { Subject } from "rxjs";
import { takeUntil, pairwise, filter, map } from "rxjs/operators";

import { isNullOrUndefined } from "../utils";

@Directive()
export abstract class BaseControl implements OnInit, OnDestroy, ControlValueAccessor {

	private readonly destroy$ = new Subject<void>();

	private propagateChange: Function;
	private propagateBlur: Function;

	valueControl: AbstractControl;

	constructor(
		private readonly ngControl: NgControl,
		private readonly controlContainer: FormGroupDirective) {
		if (this.ngControl !== null) {
			// Setting the value accessor directly (instead of using
			// the providers) to avoid running into a circular import.
			this.ngControl.valueAccessor = this;
		}
	}

	ngOnInit(): void {
		this.valueControl = this.controlContainer.form.controls[this.ngControl.name];
		this.valueControl.valueChanges.pipe(
			takeUntil(this.destroy$),
			pairwise(),
			filter(([oldValue, newValue]) => oldValue !== newValue),
			map(([_, newValue]) => newValue)
		).subscribe((newValue) => this.propagateChange(newValue));
	}

	writeValue(value: string): void {
		if (!isNullOrUndefined(this.valueControl) && !isNullOrUndefined(value)) {
			this.valueControl.setValue(value);
		}
	}

	registerOnChange(fn: any): void {
		this.propagateChange = fn;
	}

	registerOnTouched(fn: any): void {
		this.propagateBlur = fn;
	}

	setDisabledState?(isDisabled: boolean): void {
		isDisabled ? this.valueControl.disable() : this.valueControl.enable();
	}

	ngOnDestroy(): void {
		this.destroy$.next();
		this.destroy$.complete();
	}

}
