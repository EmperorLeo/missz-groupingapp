import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GroupsComponent } from './groups.component';
import { GroupComponent } from './group/group.component';

const routes: Routes = [{
  path: '',
  component: GroupsComponent
}, {
  path: ':id',
  component: GroupComponent
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class GroupsRoutingModule { }
