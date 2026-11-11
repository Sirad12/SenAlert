import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CarteComponent } from '../ui/carte.component';
import { communeDe, SignalementService, TYPES } from '../signalement.service';

@Component({
  selector: 'app-signaler',
  imports: [FormsModule, RouterLink, CarteComponent],
  template: `
    <div class="page" style="max-width:640px">
      @if (code()) {
        <h1>Signalement enregistré</h1>
        <p>Votre identifiant de suivi :</p>
        <p style="font:600 2rem Fraunces,serif;margin:4px 0">{{ code() }}</p>
        <p class="mut">Conservez-le : il permet de suivre le signalement sans compte, en lecture seule.</p>
        <a routerLink="/"><button class="main">Voir la carte</button></a>
        <a routerLink="/suivre"><button style="margin-left:8px">Suivre un signalement</button></a>
      } @else {
        <h1>Signaler un problème</h1>
        @if (erreur()) { <p class="err">{{ erreur() }}</p> }
        <label>Type de problème</label>
        <select [ngModel]="type()" (ngModelChange)="type.set($event)">
          @for (t of types; track t) { <option>{{ t }}</option> }
        </select>
        <label>Description</label>
        <textarea rows="3" [ngModel]="description()" (ngModelChange)="description.set($event)"
                  placeholder="Décrivez le problème (10 caractères minimum)"></textarea>
        <label>Photo (JPEG ou PNG, 5 Mo maximum)</label>
        <input type="file" accept="image/jpeg,image/png" (change)="choisirPhoto($event)">
        @if (photo()) { <img [src]="photo()" alt="Aperçu de la photo"> }
        <label>Position</label>
        <p class="mut">Cliquez sur la carte. Dans la version finale, le GPS du navigateur remplira ce champ.</p>
        <app-carte [repere]="position()" (choisirPosition)="position.set($event)"/>
        <p class="mut">{{ libellePosition() }}</p>
        <button class="main" (click)="envoyer()">Envoyer le signalement</button>
      }
    </div>`,
})
export class SignalerPage {
  svc = inject(SignalementService);
  types = TYPES;
  type = signal(TYPES[0]); description = signal(''); photo = signal('');
  position = signal<{ x: number; y: number } | null>(null);
  erreur = signal(''); code = signal('');

  libellePosition() {
    const p = this.position();
    return p ? 'Position choisie : ' + communeDe(p.x, p.y) : 'Aucune position choisie';
  }

  choisirPhoto(ev: Event) {
    const f = (ev.target as HTMLInputElement).files?.[0];
    this.photo.set('');
    if (!f) return;
    if (!/^image\/(jpeg|png)$/.test(f.type)) { this.erreur.set('Format refusé : JPEG ou PNG uniquement.'); return; }
    if (f.size > 5_000_000) { this.erreur.set('Fichier trop volumineux (5 Mo maximum).'); return; }
    this.erreur.set('');
    const r = new FileReader();
    r.onload = () => this.photo.set(r.result as string);
    r.readAsDataURL(f);
  }

  envoyer() {
    const p = this.position();
    if (this.description().trim().length < 10) { this.erreur.set('La description doit contenir au moins 10 caractères.'); return; }
    if (!this.photo()) { this.erreur.set('Veuillez ajouter une photo.'); return; }
    if (!p) { this.erreur.set('Veuillez placer la position sur la carte.'); return; }
    this.code.set(this.svc.creer({ type: this.type(), description: this.description().trim(), x: p.x, y: p.y, photo: this.photo() }));
  }
}
