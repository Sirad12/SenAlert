import { Component, input } from '@angular/core';
import { COULEURS, communeDe, Signalement, Statut } from '../signalement.service';

@Component({
  selector: 'app-detail',
  template: `
    @if (s(); as r) {
      <article>
        <h2>{{ r.id }}</h2>
        <span class="st" [style.--c]="couleur(r.statut)">{{ r.statut }}</span>
        <p class="mut">{{ r.type }} · {{ commune(r.x, r.y) }}</p>
        @if (r.photo) { <img [src]="r.photo" alt="Photo du signalement"> }
        @else { <div class="vide">Pas de photo (donnée de démonstration)</div> }
        <p>{{ r.description }}</p>
        @if (r.apres) { <p class="mut">Après intervention</p><img [src]="r.apres" alt="Photo après intervention"> }
        <h3>Historique</h3>
        <ol class="histo">
          @for (h of r.historique; track $index) {
            <li><b>{{ h.statut }}</b> · {{ h.date }}
              @if (h.note) { <br><span class="mut">{{ h.note }}</span> }
            </li>
          }
        </ol>
        <ng-content />
      </article>
    } @else {
      <p class="mut">Choisissez un point sur la carte pour voir son détail.</p>
    }`,
})
export class DetailComponent {
  s = input<Signalement | undefined>();
  couleur = (x: Statut) => COULEURS[x];
  commune = communeDe;
}
