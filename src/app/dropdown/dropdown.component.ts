import { ChangeDetectionStrategy, Component, ElementRef, EventEmitter, HostListener, Input, Output } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

enum DropdownStateEnum {
    Opened,
    Closed
}

@Component({
    selector: 'app-dropdown',
    templateUrl: './dropdown.component.html',
    styleUrls: ['./dropdown.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: DropdownComponent,
            multi: true
        }
    ]

})
export class DropdownComponent<T extends object> implements ControlValueAccessor {
    @HostListener('document:click', ['$event.target'])
    onClickOutside(targetElement: unknown): void {
        const clickedInside = this.elementRef.nativeElement.contains(targetElement);

        if (!clickedInside) {
            this.state = DropdownStateEnum.Closed;
        }
    }

    readonly DropdownStateEnum = DropdownStateEnum;

    @Input() items: T[] | null = [];

    @Input() label!: keyof T;
    @Input() value!: keyof T;

    @Input() placeholder = 'Select item';

    state = DropdownStateEnum.Closed;

    selectedItem: T | undefined;

    @Output() selected = new EventEmitter<T>();

    disabled = false;

    onChange = (value: T) => {};

    constructor(private readonly elementRef: ElementRef) {}

    writeValue(obj: T | null): void {
        if (!obj) {
            return;
        }

        this.selectedItem = obj;
    }

    registerOnChange(fn: any): void {
        this.onChange = fn;
    }
    registerOnTouched(fn: any): void {}
    setDisabledState?(isDisabled: boolean): void {
        this.disabled = isDisabled;
    }

    select(value: unknown) {
        this.selectedItem = this.items?.find(item => item[this.value] === value) as T;
        this.selected.emit(this.selectedItem);

        this.onChange(this.selectedItem);
    }

    toggle() {
        this.state = this.state === DropdownStateEnum.Opened ? DropdownStateEnum.Closed : DropdownStateEnum.Opened;
    }


    remove(e: Event) {
        e.stopPropagation();

        this.selectedItem = undefined;
    }
}
