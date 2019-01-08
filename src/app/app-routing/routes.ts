import { Routes } from '@angular/router';

import { HomeComponent } from '../home/home.component';
import { TeamComponent } from '../team/team.component';
import { MarketComponent } from '../market/market.component';
import { StandingComponent } from '../standing/standing.component';
import { AboutusComponent } from '../aboutus/aboutus.component';
import { ContactComponent } from '../contact/contact.component';
import { FaqComponent } from '../faq/faq.component';

export const routes : Routes = [
    {path: "home", component: HomeComponent},
    {path: "", redirectTo: "/home", pathMatch: "full"},
    {path: "team", component: TeamComponent},
    {path: "market", component: MarketComponent},
    {path: "standings", component: StandingComponent},
    {path: "aboutus", component: AboutusComponent},
    {path: "contact", component: ContactComponent},
    {path: "faq", component: FaqComponent}
];
