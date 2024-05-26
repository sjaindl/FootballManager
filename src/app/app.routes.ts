import { Routes } from '@angular/router';
import { adminGuard } from './guards/admin.guard';
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
  { path: 'home/logout', component: HomeComponent },
  {
    path: 'prices',
    loadComponent: () =>
      import('./prices/prices.component').then(mod => mod.PricesComponent),
  },
  // with login
  {
    path: '',
    canActivateChild: [
      // authGuard,
      configGuard,
      usersGuard,
      matchdayGuard,
      playersGuard,
    ],
    children: [
      // {
      //   path: '',
      //   canActivateChild: [
      //     authGuard,
      //     // configGuard,
      //     usersGuard,
      //     matchdayGuard,
      //     playersGuard,
      //   ],
      //   children: [
      {
        path: 'players',
        loadComponent: () =>
          import('./players/players.component').then(
            mod => mod.PlayersComponent
          ),
      },
      {
        path: 'standings',
        // runGuardsAndResolvers: 'always',
        loadComponent: () =>
          import('./standings/standings.component').then(
            mod => mod.StandingsComponent
          ),
        canActivate: [userMatchdayGuard, pointsGuard],
      },

      {
        path: 'profile',
        loadComponent: () =>
          import('./user/components/user-profile/user-profile.component').then(
            mod => mod.UserProfileComponent
          ),
        // canActivate: [authGuard],
      },
      {
        path: 'admin',
        canActivateChild: [adminGuard, usersGuard, matchdayGuard],
        children: [
          {
            path: 'points',
            loadComponent: () =>
              import(
                './admin/container/admin-points/admin-points.component'
              ).then(mod => mod.AdminPointsComponent),
            canActivate: [userLineupGuard, userMatchdayGuard],
          },
          {
            path: 'bets',
            // runGuardsAndResolvers: 'always',
            loadComponent: () =>
              import('./admin/container/user-bets/user-bets.component').then(
                mod => mod.UserBetsComponent
              ),
            canActivate: [bettingGuard, userBettingGuard, userMatchdayGuard],
          },
        ],
      },

      {
        path: 'lineup',
        loadComponent: () =>
          import('./lineup/container/lineup/lineup.component').then(
            mod => mod.LineupComponent
          ),
        canActivate: [formationsGuard, selectedFormationGuard, lineupGuard],
      },
    ],
    //   },
    // ],
  },

  {
    path: 'home',
    component: HomeComponent,
    canActivate: [userMatchdayGuard, bettingGuard],
  },
  { path: '**', redirectTo: 'home' },
];
