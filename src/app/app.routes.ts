import { Routes } from '@angular/router';
import { adminGuard } from './guards/admin.guard';
import { authGuard } from './guards/auth.guard';
import { configGuard } from './guards/config.guard';
import { formationsGuard } from './guards/formations.guard';
import { lineupGuard } from './guards/lineup.guard';
import { matchdayGuard } from './guards/matchday.guard';
import { playersGuard } from './guards/players.guard';
import { selectedFormationGuard } from './guards/selected-formation.guard';
import { userMatchdayGuard } from './guards/usermatchday.guard';
import { usersGuard } from './guards/users.guard';
import { HomeComponent } from './home/home.component';
import { userLineupGuard } from './guards/userlineup.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'home/logout', component: HomeComponent },
  {
    path: 'faq',
    loadComponent: () =>
      import('./faq/faq.component').then(mod => mod.FaqComponent),
  },
  {
    path: 'privacy',
    loadComponent: () =>
      import('./privacy-policy/privacy-policy.component').then(
        mod => mod.PrivacyPolicyComponent
      ),
  },
  {
    path: 'players',
    loadComponent: () =>
      import('./players/players.component').then(mod => mod.PlayersComponent),
    canActivate: [matchdayGuard, playersGuard],
  },
  {
    path: 'standings',
    loadComponent: () =>
      import('./standings/standings.component').then(
        mod => mod.StandingsComponent
      ),
    canActivate: [matchdayGuard, playersGuard, userMatchdayGuard, usersGuard],
  },
  {
    path: 'prices',
    loadComponent: () =>
      import('./prices/prices.component').then(mod => mod.PricesComponent),
  },
  {
    path: 'profile',
    loadComponent: () =>
      import('./user/components/user-profile/user-profile.component').then(
        mod => mod.UserProfileComponent
      ),
    canActivate: [authGuard],
  },
  {
    path: 'admin',
    loadComponent: () =>
      import('./admin/container/admin.component').then(
        mod => mod.AdminComponent
      ),
    canActivate: [matchdayGuard, playersGuard, adminGuard, configGuard, userLineupGuard, userMatchdayGuard],
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
      configGuard,
    ],
  },
  { path: '**', component: HomeComponent },
];
