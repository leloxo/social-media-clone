import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { ProfileComponent } from './user/profile/profile.component';
import { SearchComponent } from './user/search/search.component';
import { HomeComponent } from './home/home.component';
import { PostComponent } from './post/post.component';
import { AppLayout } from './layout/component/app.layout';

export const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },

    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    
    { path: '', 
        component: AppLayout, 
        children: [
            { path: 'home', component: HomeComponent },
            { path: 'profile', redirectTo: 'profile/me', pathMatch: 'full' },
            { path: 'profile/:username', component: ProfileComponent },
            { path: 'search', component: SearchComponent },
            { path: 'upload', component: PostComponent },
        ]
    },

    { path: '**', redirectTo: 'login' }
];
