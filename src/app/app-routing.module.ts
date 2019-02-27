import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './core/auth.guard';
import { LayoutComponent } from './layout/layout.component';

const routes: Routes = [{
  path: 'login',
  loadChildren: './login/login.module#LoginModule'
}, {
  path: '',
  component: LayoutComponent,
  children: [{
    path: '',
    loadChildren: './groups/groups.module#GroupsModule'
  }],
  canActivate: [AuthGuard]
}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
