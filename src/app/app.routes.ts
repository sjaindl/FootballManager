import { Routes } from '@angular/router';
import { adminGuard } from './guards/admin.guard';
import { authGuard } from './guards/auth.guard';
import { formationsGuard } from './guards/formations.guard';
import { lineupGuard } from './guards/lineup.guard';
import { playersGuard } from './guards/players.guard';
import { selectedFormationGuard } from './guards/selected-formation.guard';
import { HomeComponent } from './home/home.component';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  {
    path: 'faq',
    loadComponent: () =>
      import('./faq/faq.component').then(mod => mod.FaqComponent),
  },
  {
    path: 'admin',
    loadComponent: () =>
      import('./admin/container/admin.component').then(
        mod => mod.AdminComponent
      ),
    canActivate: [adminGuard],
  },
  {
    path: 'lineup',
    loadComponent: () =>
      import('./lineup/container/lineup/lineup.component').then(
        mod => mod.LineupComponent
      ),
    // TODO: Move to parent
    canActivate: [
      authGuard,
      formationsGuard,
      selectedFormationGuard,
      playersGuard,
      lineupGuard,
    ],
  },
  { path: '**', component: HomeComponent },
];
