import { Routes } from '@angular/router'

import { HomeComponent } from '../home/home.component'
import { AuthService } from '../services/auth.service'
import { ProfileComponent } from '../profile/profile.component'

export const routes : Routes = [
    { path: "home", component: HomeComponent },
    { path: "", redirectTo: "/home", pathMatch: "full" },
    {path: "home/:logout", component: HomeComponent},
    { path: "profile", component: ProfileComponent, canActivate: [AuthService] },
]
