import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CarteComponent } from '../ui/carte.component';
import { DetailComponent } from '../ui/detail.component';
import { COULEURS, SignalementService, STATUTS, TYPES } from '../signalement.service';

@Component({
  selector: 'app-accueil',
  imports: [FormsModule, RouterLink, CarteComponent, DetailComponent],
  template: `
    <div class="page">
      <h1>Rues, canaux et caniveaux bouchés</h1>
      <p class="mut">Les points bloqués signalés par les habitants. Données de démonstration.</p>
      <div class="split">
        <section>
          <div class="duo">
            <select [ngModel]="type()" (ngModelChange)="type.set($event)">
              <option value="">Tous les types</option>
              @for (t of types; track t) { <option>{{ t }}</option> }
            </select>
            <select [ngModel]="statut()" (ngModelChange)="statut.set($event)">
              <option value="">Tous les statuts</option>
              @for (s of statuts; track s) { <option>{{ s }}</option> }
            </select>
          </div>
          <app-carte [signalements]="visibles()" [selection]="choix()" (choisirSignalement)="choix.set($event)"/>
          <p class="mut">
            @for (s of statuts; track s) { <span class="st" [style.--c]="couleurs[s]" style="margin-right:14px">{{ s }}</span> }
          </p>
        </section>
        <aside>
          <app-detail [s]="courant()"/>
          <hr style="border:0;border-top:1px solid var(--trait);margin:18px 0">
          <a routerLink="/signaler"><button class="main">Signaler un problème</button></a>
        </aside>
      </div>
    </div>`,
})
export class AccueilPage {
  svc = inject(SignalementService);
  types = TYPES; statuts = STATUTS; couleurs = COULEURS;
  type = signal(''); statut = signal(''); choix = signal<string | null>(null);
  visibles = computed(() => this.svc.liste().filter(r =>
    (!this.type() || r.type === this.type()) && (!this.statut() || r.statut === this.statut())));
  courant = computed(() => this.svc.liste().find(r => r.id === this.choix()));
}
