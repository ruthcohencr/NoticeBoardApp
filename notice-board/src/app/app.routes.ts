import { Routes } from '@angular/router';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { MyNoticesComponent } from './notices/my-notices/my-notices.component';
import { CreateNoticeComponent } from './notices/create-notice/create-notice.component';
import { EditNoticeComponent } from './notices/edit-notice/edit-notice.component';
import { NoticesSearchComponent } from './notices/notices-search/notices-search.component';
import { RegisterComponent } from './security/register/register.component';
import { LoginComponent } from './security/login/login.component';
import { isAuthenticatedGuard } from './Shared/guards/is-authenticated.guard';

export const routes: Routes = [
    {path: '', component: LandingPageComponent},

    {path: 'my-notices', component: MyNoticesComponent, canActivate: [isAuthenticatedGuard]},
    {path: 'my-notices/create', component: CreateNoticeComponent, canActivate: [isAuthenticatedGuard]},
    {path: 'my-notices/edit/:id', component: EditNoticeComponent, canActivate: [isAuthenticatedGuard]},

    {path: 'notices/search', component: NoticesSearchComponent},
    
    {path: 'register', component: RegisterComponent},
    {path: 'login', component: LoginComponent},

   
    {path: '**', redirectTo: ''}
];
