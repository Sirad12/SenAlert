import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DetailComponent } from '../ui/detail.component';
import { SignalementService } from '../signalement.service';

@Component({
  selector: 'app-suivre',
  imports: [FormsModule, DetailComponent],
  template: `
    <div class="page" style="max-width:560px">
      <h1>Suivre un signalement</h1>
      <div class="duo" style="grid-template-columns:1fr auto">
        <input [ngModel]="saisie()" (ngModelChange)="saisie.set($event)" placeholder="Ex. SIG-000119" (keyup.enter)="chercher()">
        <button class="main" (click)="chercher()">Rechercher</button>
      </div>
      @if (cherche() && !resultat()) { <p class="err">Aucun signalement avec ce code.</p> }
      @else { <app-detail [s]="resultat()"/> }
      <p class="mut">Essayez SIG-000119 ou SIG-000118.</p>
    </div>`,
})
export class SuivrePage {
  svc = inject(SignalementService);
  saisie = signal('');
  code = signal('');
  cherche = signal(false);
  resultat = computed(() => this.svc.trouver(this.code()));
  chercher() { this.code.set(this.saisie().trim().toUpperCase()); this.cherche.set(true); }
}
