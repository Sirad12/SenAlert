import { Injectable, signal, computed } from '@angular/core';

export type Statut = 'Signalé' | 'Vérifié' | 'En traitement' | 'Résolu' | 'Rejeté';
export const STATUTS: Statut[] = ['Signalé', 'Vérifié', 'En traitement', 'Résolu', 'Rejeté'];
export const TYPES = ['Rue bouchée', 'Canal bouché', 'Caniveau bouché'];
export const COULEURS: Record<Statut, string> = {
  'Signalé': '#c4552d', 'Vérifié': '#b8860b', 'En traitement': '#2b5fa8',
  'Résolu': '#3d7a4a', 'Rejeté': '#8a8577',
};
export const ZONES = [
  { n: 'Parcelles Assainies', x: 200, y: 80 }, { n: 'Guédiawaye', x: 360, y: 70 },
  { n: 'Pikine', x: 310, y: 190 }, { n: 'Keur Massar', x: 480, y: 170 },
  { n: 'Rufisque', x: 520, y: 310 },
];
export const communeDe = (x: number, y: number) =>
  ZONES.reduce((a, z) => (Math.hypot(z.x - x, z.y - y) < Math.hypot(a.x - x, a.y - y) ? z : a)).n;

export interface Etape { statut: Statut; date: string; note: string }
export interface Signalement {
  id: string; type: string; description: string; x: number; y: number;
  statut: Statut; photo?: string; apres?: string; historique: Etape[];
}

const e = (statut: Statut, date: string, note = ''): Etape => ({ statut, date, note });
const SEED: Signalement[] = [
  { id: 'SIG-000118', type: 'Caniveau bouché', description: 'Caniveau rempli de sable devant le marché.', x: 320, y: 200, statut: 'Résolu',
    historique: [e('Signalé', '28/10/2026'), e('Vérifié', '29/10/2026'), e('En traitement', '31/10/2026'), e('Résolu', '03/11/2026', 'Caniveau curé par l’équipe communale.')] },
  { id: 'SIG-000119', type: 'Rue bouchée', description: 'Eau stagnante qui bloque la rue principale.', x: 290, y: 160, statut: 'En traitement',
    historique: [e('Signalé', '01/11/2026'), e('Vérifié', '02/11/2026'), e('En traitement', '04/11/2026', 'Intervention prévue cette semaine.')] },
  { id: 'SIG-000120', type: 'Canal bouché', description: 'Canal à ciel ouvert plein de déchets.', x: 470, y: 150, statut: 'Vérifié',
    historique: [e('Signalé', '03/11/2026'), e('Vérifié', '05/11/2026')] },
  { id: 'SIG-000121', type: 'Caniveau bouché', description: 'Grille d’évacuation obstruée près de l’école.', x: 350, y: 95, statut: 'Signalé',
    historique: [e('Signalé', '06/11/2026')] },
  { id: 'SIG-000122', type: 'Caniveau bouché', description: 'Caniveau effondré et rempli de gravats.', x: 210, y: 100, statut: 'Signalé',
    historique: [e('Signalé', '07/11/2026')] },
  { id: 'SIG-000117', type: 'Rue bouchée', description: 'Signalement déjà fait ailleurs.', x: 520, y: 290, statut: 'Rejeté',
    historique: [e('Signalé', '25/10/2026'), e('Rejeté', '27/10/2026', 'Motif : doublon')] },
];

/** Seul endroit à remplacer par des appels HttpClient vers l’API FastAPI. */
@Injectable({ providedIn: 'root' })
export class SignalementService {
  private suivant = 123;
  readonly liste = signal<Signalement[]>(SEED);
  readonly admin = signal(false);
  readonly parStatut = computed(() =>
    STATUTS.map(s => ({ statut: s, n: this.liste().filter(r => r.statut === s).length })));

  trouver(id: string) { return this.liste().find(r => r.id === id); }

  creer(d: { type: string; description: string; x: number; y: number; photo: string }): string {
    const id = 'SIG-' + String(this.suivant++).padStart(6, '0');
    this.liste.update(l => [...l, { ...d, id, statut: 'Signalé', historique: [e('Signalé', new Date().toLocaleDateString('fr-FR'))] }]);
    return id;
  }

  changer(id: string, statut: Statut, note = '', apres?: string) {
    this.liste.update(l => l.map(r => r.id !== id ? r : {
      ...r, statut, apres: apres ?? r.apres,
      historique: [...r.historique, e(statut, new Date().toLocaleDateString('fr-FR'), note)],
    }));
  }

  connexion(u: string, p: string): boolean {
    const ok = u === 'admin' && p === 'demo123';
    this.admin.set(ok);
    return ok;
  }
}
