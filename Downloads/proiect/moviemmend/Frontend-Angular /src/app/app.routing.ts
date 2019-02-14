import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home';
import { LoginComponent } from './login';
import { RegisterComponent } from './register';
import { AuthGuard } from './_guards';
import { ProfileComponent } from './profile/profile.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { MovieListComponent } from './movies/movie-list.component';
import { MovieRecComponent } from './movies/movie-rec.component';

const appRoutes: Routes = [
    { path: '', redirectTo: 'welcome', pathMatch: 'full' },
    { path: 'home', component: HomeComponent, canActivate: [AuthGuard] },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent }, 
    { path: 'welcome', component: WelcomeComponent },
    { path: 'profile-settings', component: ProfileComponent, canActivate: [AuthGuard] },
    { path: 'profile-search/:id', component: MovieListComponent, canActivate: [AuthGuard] },
    { path: 'profile-rec', component: MovieRecComponent, canActivate: [AuthGuard] },


    // otherwise redirect to home
    { path: '**', redirectTo: 'welcome', pathMatch: 'full' },
];

export const routing = RouterModule.forRoot(appRoutes);