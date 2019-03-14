import { Routes } from '@angular/router'

import { HomeComponent } from '../home/home.component'
import { TeamComponent } from '../team/team.component'
import { MarketComponent } from '../market/market.component'
import { StandingComponent } from '../standing/standing.component'
import { AboutusComponent } from '../aboutus/aboutus.component'
import { ContactComponent } from '../contact/contact.component'
import { FaqComponent } from '../faq/faq.component'
import { AuthService } from '../services/auth.service'
import { AdminareaComponent } from '../adminarea/adminarea.component'
import { AdminService } from '../services/admin.service';
import { PrivacyPolicyComponent } from '../privacy-policy/privacy-policy.component';

export const routes : Routes = [
    { path: "home", component: HomeComponent },
    { path: "", redirectTo: "/home", pathMatch: "full" },
    { path: "team", component: TeamComponent, canActivate: [AuthService] },
    { path: "market", component: MarketComponent, canActivate: [AuthService] },
    { path: "standings", component: StandingComponent, canActivate: [AuthService] },
    { path: "aboutus", component: AboutusComponent },
    { path: "contact", component: ContactComponent },
    { path: "faq", component: FaqComponent },
    { path: "privacy", component: PrivacyPolicyComponent },
    { path: "admin", component: AdminareaComponent, canActivate: [AdminService] }
]
