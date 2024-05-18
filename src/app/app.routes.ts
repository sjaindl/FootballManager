import { Routes } from '@angular/router';
import { adminGuard } from './guards/admin.guard';
import { authGuard } from './guards/auth.guard';
import { bettingGuard } from './guards/betting.guard';
import { configGuard } from './guards/config.guard';
import { formationsGuard } from './guards/formations.guard';
import { lineupGuard } from './guards/lineup.guard';
import { matchdayGuard } from './guards/matchday.guard';
import { playersGuard } from './guards/players.guard';
import { pointsGuard } from './guards/points.guard';
import { selectedFormationGuard } from './guards/selected-formation.guard';
import { userBettingGuard } from './guards/user-betting.guard';
import { userLineupGuard } from './guards/userlineup.guard';
import { userMatchdayGuard } from './guards/usermatchday.guard';
import { usersGuard } from './guards/users.guard';
import { HomeComponent } from './home/home.component';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [userMatchdayGuard, bettingGuard],
  },
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
    // runGuardsAndResolvers: 'always',
    loadComponent: () =>
      import('./standings/standings.component').then(
        mod => mod.StandingsComponent
      ),
    canActivate: [
      matchdayGuard,
      playersGuard,
      userMatchdayGuard,
      usersGuard,
      pointsGuard,
    ],
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
    path: 'admin/points',
    loadComponent: () =>
      import('./admin/container/admin-points/admin-points.component').then(
        mod => mod.AdminPointsComponent
      ),
    canActivate: [
      matchdayGuard,
      playersGuard,
      adminGuard,
      configGuard,
      userLineupGuard,
      userMatchdayGuard,
    ],
  },
  {
    path: 'admin/bets',
    // runGuardsAndResolvers: 'always',
    loadComponent: () =>
      import('./admin/container/user-bets/user-bets.component').then(
        mod => mod.UserBetsComponent
      ),
    canActivate: [
      adminGuard,
      bettingGuard,
      userBettingGuard,
      matchdayGuard,
      userMatchdayGuard,
      usersGuard,
    ],
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
