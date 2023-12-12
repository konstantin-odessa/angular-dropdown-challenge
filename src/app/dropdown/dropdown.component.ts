import { ChangeDetectionStrategy, Component, ElementRef, EventEmitter, HostListener, Input, Output } from '@angular/core';

enum DropdownStateEnum {
    Opened,
    Closed
}

@Component({
  selector: 'app-dropdown',
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DropdownComponent<T extends object> {
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

    constructor(private readonly elementRef: ElementRef) {}

    select(value: unknown) {
        this.selectedItem = this.items?.find(item => item[this.value] === value) as T;
        this.selected.emit(this.selectedItem);
    }

    toggle() {
        this.state = this.state === DropdownStateEnum.Opened ? DropdownStateEnum.Closed : DropdownStateEnum.Opened;
    }


    remove(e: Event) {
        e.stopPropagation();

        this.selectedItem = undefined;
    }
}
