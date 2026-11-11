import { Routes } from '@angular/router';
import { AccueilPage } from './pages/accueil.page';
import { SignalerPage } from './pages/signaler.page';
import { SuivrePage } from './pages/suivre.page';
import { AdminPage } from './pages/admin.page';

export const routes: Routes = [
  { path: '', component: AccueilPage, title: 'SenAlert · Carte' },
  { path: 'signaler', component: SignalerPage, title: 'SenAlert · Signaler' },
  { path: 'suivre', component: SuivrePage, title: 'SenAlert · Suivre' },
  { path: 'admin', component: AdminPage, title: 'SenAlert · Administration' },
  { path: '**', redirectTo: '' },
];
