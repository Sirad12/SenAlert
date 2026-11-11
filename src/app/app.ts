import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <header style="background:var(--encre);color:var(--papier);padding:14px 20px;display:flex;justify-content:space-between;align-items:baseline;flex-wrap:wrap;gap:10px">
      <a routerLink="/" style="font:600 1.4rem Fraunces,serif;text-decoration:none;color:inherit">SenAlert</a>
      <nav style="display:flex;gap:18px">
        @for (l of liens; track l[0]) {
          <a [routerLink]="l[0]" routerLinkActive="actif" [routerLinkActiveOptions]="{ exact: true }"
             style="color:inherit;text-underline-offset:6px">{{ l[1] }}</a>
        }
      </nav>
    </header>
    <router-outlet />`,
  styles: [`.actif{text-decoration:underline;text-decoration-color:#c4552d;text-decoration-thickness:3px}`],
})
export class App {
  liens = [['/', 'Carte'], ['/signaler', 'Signaler'], ['/suivre', 'Suivre'], ['/admin', 'Administration']];
}
