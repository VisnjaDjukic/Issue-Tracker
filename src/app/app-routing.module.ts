import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { IssueListComponent } from './issue/issue-list/issue-list.component';
import { IssuePostComponent } from './issue/issue-post/issue-post.component';

const routes: Routes = [
  { path: '', component: IssueListComponent },
  { path: 'create', component: IssuePostComponent },
  { path: 'edit/:issueId', component: IssuePostComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
