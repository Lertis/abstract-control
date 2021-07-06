import { FormGroupDirective, NgControl } from "@angular/forms";
import { ChangeDetectionStrategy, Component, Input, Optional, Self } from "@angular/core";

import { BaseControl } from "../base-control/base-control.component";

@Component({
	selector: "ac-input-field",
	templateUrl: "./input-field.component.html",
	styleUrls: ["./input-field.component.scss"],
	changeDetection: ChangeDetectionStrategy.OnPush
})
export class InputFieldComponent extends BaseControl {

	@Input() placeholder: string;
	@Input() label: string;
	@Input() hint: string;
	@Input() type = "text";

	constructor(
		@Optional() @Self() ngControl: NgControl,
		@Optional() controlContainer: FormGroupDirective) {
		super(ngControl, controlContainer);
	}

}
