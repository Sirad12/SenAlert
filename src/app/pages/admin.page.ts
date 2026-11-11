import { NgTemplateOutlet } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DetailComponent } from '../ui/detail.component';
import { COULEURS, communeDe, SignalementService, Statut, STATUTS } from '../signalement.service';

@Component({
  selector: 'app-admin',
  imports: [FormsModule, NgTemplateOutlet, DetailComponent],
  template: `
    <div class="page">
      @if (!svc.admin()) {
        <div style="max-width:360px">
          <h1>Espace administrateur</h1>
          @if (erreur()) { <p class="err">{{ erreur() }}</p> }
          <label>Identifiant</label><input [(ngModel)]="u">
          <label>Mot de passe</label><input type="password" [(ngModel)]="p">
          <p><button class="main" (click)="connecter()">Se connecter</button></p>
          <p class="mut">Démonstration : admin / demo123 (compte fictif).</p>
        </div>
      } @else {
        <h1>Suivi des signalements</h1>
        <div class="stats">
          @for (x of svc.parStatut(); track x.statut) {
            <div><b [style.color]="couleurs[x.statut]">{{ x.n }}</b><span class="mut">{{ x.statut }}</span></div>
          }
        </div>
        <div class="split">
          <section>
            <div class="duo" style="grid-template-columns:1fr auto">
              <select [ngModel]="filtre()" (ngModelChange)="filtre.set($event)">
                <option value="">Tous les statuts</option>
                @for (s of statuts; track s) { <option>{{ s }}</option> }
              </select>
              <button (click)="svc.admin.set(false)">Se déconnecter</button>
            </div>
            <table>
              <tr><th>Code</th><th>Type</th><th>Commune</th><th>Statut</th></tr>
              @for (r of visibles(); track r.id) {
                <tr class="ligne" (click)="choix.set(r.id); erreur.set('')">
                  <td>{{ r.id }}</td><td>{{ r.type }}</td><td>{{ commune(r.x, r.y) }}</td>
                  <td><span class="st" [style.--c]="couleurs[r.statut]">{{ r.statut }}</span></td>
                </tr>
              }
            </table>
          </section>
          <aside>
            <app-detail [s]="courant()">
              @if (courant(); as r) {
                <hr style="border:0;border-top:1px solid var(--trait);margin:14px 0">
                @if (erreur()) { <p class="err">{{ erreur() }}</p> }
                @switch (r.statut) {
                  @case ('Signalé') {
                    <button class="main" (click)="avancer('Vérifié')">Marquer vérifié</button>
                    <ng-container *ngTemplateOutlet="rejet"/>
                  }
                  @case ('Vérifié') {
                    <button class="main" (click)="avancer('En traitement')">Prendre en charge</button>
                    <ng-container *ngTemplateOutlet="rejet"/>
                  }
                  @case ('En traitement') {
                    <label>Note de résolution (obligatoire)</label>
                    <textarea rows="2" [ngModel]="note()" (ngModelChange)="note.set($event)"></textarea>
                    <label>Photo après intervention (facultative)</label>
                    <input type="file" accept="image/jpeg,image/png" (change)="choisirApres($event)">
                    <p><button class="main" (click)="resoudre()">Marquer résolu</button></p>
                  }
                  @default { <p class="mut">Statut final : aucune action possible.</p> }
                }
              }
            </app-detail>
          </aside>
        </div>
      }
    </div>
    <ng-template #rejet>
      <label>Motif de rejet</label>
      <select [ngModel]="motif()" (ngModelChange)="motif.set($event)">
        <option>Doublon</option><option>Hors sujet</option><option>Contenu inapproprié</option>
      </select>
      <p><button (click)="avancer('Rejeté', 'Motif : ' + motif())">Rejeter</button></p>
    </ng-template>`,
})
export class AdminPage {
  svc = inject(SignalementService);
  statuts = STATUTS; couleurs = COULEURS; commune = communeDe;
  u = 'admin'; p = 'demo123';
  filtre = signal(''); choix = signal<string | null>(null);
  note = signal(''); motif = signal('Doublon'); apres = signal(''); erreur = signal('');
  visibles = computed(() => this.svc.liste().filter(r => !this.filtre() || r.statut === this.filtre()));
  courant = computed(() => this.svc.liste().find(r => r.id === this.choix()));

  connecter() { this.erreur.set(this.svc.connexion(this.u, this.p) ? '' : 'Identifiants incorrects.'); }
  avancer(s: Statut, note = '') { this.svc.changer(this.choix()!, s, note); }

  choisirApres(ev: Event) {
    const f = (ev.target as HTMLInputElement).files?.[0];
    this.apres.set('');
    if (!f) return;
    if (!/^image\/(jpeg|png)$/.test(f.type) || f.size > 5_000_000) { this.erreur.set('Photo refusée : JPEG ou PNG, 5 Mo maximum.'); return; }
    const r = new FileReader();
    r.onload = () => this.apres.set(r.result as string);
    r.readAsDataURL(f);
  }

  resoudre() {
    if (!this.note().trim()) { this.erreur.set('La note de résolution est obligatoire.'); return; }
    this.svc.changer(this.choix()!, 'Résolu', this.note().trim(), this.apres() || undefined);
    this.note.set(''); this.apres.set(''); this.erreur.set('');
  }
}
