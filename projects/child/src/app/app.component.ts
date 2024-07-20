import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { IframeService } from './iframe.service';
import { AsyncPipe } from '@angular/common';
import { tap } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, AsyncPipe],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  iframeService: IframeService = inject(IframeService);
  myObject = { value: 2 };
  myValue$ = this.iframeService
    .getAttribute('customAttribute')
    .pipe(tap(console.log));

  dispatch(value: unknown): void {
    this.iframeService.dispatchEvent('testEvent', value);
  }
}
