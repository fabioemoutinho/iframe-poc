import { Injectable, NgZone } from '@angular/core';
import { BehaviorSubject, distinctUntilChanged, map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class IframeService {
  private observer?: MutationObserver = undefined;
  private attributeChanges = new BehaviorSubject<{
    [key: string]: unknown;
  }>({});
  attributeChanges$ = this.attributeChanges.asObservable();

  getAttribute<T>(attributeName: string): Observable<T | undefined> {
    const value: T | undefined =
      (window.frameElement?.getAttribute(attributeName) as T | null) ??
      undefined;
    console.log('getAttribute', attributeName, value);
    if (value !== undefined) {
      this.attributeChanges.next({
        ...this.attributeChanges.value,
        [attributeName.toLocaleLowerCase()]: value,
      });
    }
    return this.attributeChanges$.pipe(
      map(
        (changes) =>
          (changes[attributeName.toLocaleLowerCase()] as T | undefined) ??
          undefined
      ),
      distinctUntilChanged()
    );
  }

  dispatchEvent(eventName: string, value: unknown): void {
    if (window.frameElement) {
      window.frameElement.dispatchEvent(
        new CustomEvent(eventName, { detail: value })
      );
    }
  }

  constructor(private zone: NgZone) {
    this.initObserver();
  }

  private initObserver() {
    console.log('initObserver', window.frameElement);
    if (window.frameElement) {
      this.observer = new MutationObserver((mutations) => {
        this.zone.run(() => {
          mutations.forEach((mutation) => {
            if (mutation.type === 'attributes') {
              console.log('attribute changed', mutation.attributeName);
              this.attributeChanges.next({
                ...this.attributeChanges.value,
                [mutation.attributeName ?? '']: (
                  mutation.target as HTMLElement
                ).getAttribute(mutation.attributeName ?? ''),
              });
            }
          });
        });
      });

      this.observer.observe(window.frameElement, {
        attributes: true,
      });
    }
  }

  ngOnDestroy() {
    if (this.observer) {
      this.observer.disconnect();
    }
  }
}
