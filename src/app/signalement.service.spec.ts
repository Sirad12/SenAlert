import { TestBed } from '@angular/core/testing';
import { SignalementService } from './signalement.service';

describe('SignalementService', () => {
  let svc: SignalementService;
  beforeEach(() => { TestBed.configureTestingModule({}); svc = TestBed.inject(SignalementService); });

  it('crée un signalement avec un identifiant unique et le statut Signalé', () => {
    const a = svc.creer({ type: 'Caniveau bouché', description: 'Caniveau bouché devant l’école', x: 10, y: 10, photo: 'data:image/png;base64,AA' });
    const b = svc.creer({ type: 'Rue bouchée', description: 'Rue inondée près du marché', x: 20, y: 20, photo: 'data:image/png;base64,AA' });
    expect(a).not.toBe(b);
    expect(svc.trouver(a)?.statut).toBe('Signalé');
  });

  it('enregistre chaque changement de statut dans l’historique', () => {
    const id = svc.creer({ type: 'Canal bouché', description: 'Canal plein de déchets', x: 5, y: 5, photo: 'data:image/png;base64,AA' });
    svc.changer(id, 'Vérifié');
    expect(svc.trouver(id)?.historique.map(h => h.statut)).toEqual(['Signalé', 'Vérifié']);
  });

  it('refuse un mauvais mot de passe administrateur', () => {
    expect(svc.connexion('admin', 'faux')).toBe(false);
    expect(svc.admin()).toBe(false);
    expect(svc.connexion('admin', 'demo123')).toBe(true);
  });
});
