import { ElementRef, HostListener, Directive, AfterViewInit, AfterViewChecked } from '@angular/core';
import { Observable } from 'rxjs/Rx';

@Directive({
  selector: '[fz-elastic]'
})

export class ElasticDirective {
  textareaEl: HTMLTextAreaElement;

  constructor(public element: ElementRef){
  }

  isTextarea(el: HTMLElement) {
    return el.tagName === 'TEXTAREA';
  }

  setupTextarea(textareaEl: HTMLTextAreaElement) {
    this.textareaEl = textareaEl;

    const style = this.textareaEl.style;
    style.overflow = 'hidden';
    style.resize = 'none';

    Observable.fromEvent(window, 'resize')
      .debounceTime(250)
      .distinctUntilChanged((evt:any) => evt.timeStamp)
      .subscribe(() => this.adjust(true));
  }

  ngAfterViewInit() {
    if(this.isTextarea(this.element.nativeElement)) {
      this.setupTextarea(this.element.nativeElement);
      return;
    }

    const children: HTMLElement[] = Array.from(this.element.nativeElement.children) as HTMLElement[];
    const textareaEl = children.find(el => this.isTextarea(el));
    if(textareaEl) {
      this.setupTextarea(textareaEl as HTMLTextAreaElement);
      return;
    }

    throw new Error('The `elastic` attribute directive must be used on a `textarea` or an element that contains a `textarea`.');
  }

  @HostListener('input')
  onInput(): void {
    this.adjust(true);
  }

  ngAfterViewChecked(): void {
    this.adjust(false);
  }

  adjust(force: boolean): void {
    if (force || this.textareaEl.style.height !== `${this.textareaEl.scrollHeight}px`) {
      this.textareaEl.style.height = 'auto';
      this.textareaEl.style.height = this.textareaEl.scrollHeight + "px";
    }
  }
}
