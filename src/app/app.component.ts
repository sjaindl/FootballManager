import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { ConfigStore } from './lineup/store/config.store';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  imports: [RouterOutlet, HeaderComponent],
})
export class AppComponent {
  readonly configStore = inject(ConfigStore);
  title = 'S11';

  constructor() {
    this.configStore.loadConfig();
  }
}
