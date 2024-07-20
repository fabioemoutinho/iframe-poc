import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CustomIframeDirective } from './custom-iframe.directive';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CustomIframeDirective],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'parent';
  myValue: unknown = 'initial value';
  myObject = { value: 1 };

  log(value: unknown): void {
    console.log(value);
  }
}
