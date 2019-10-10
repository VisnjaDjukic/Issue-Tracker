import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { Issue } from '../issue.model';
import { IssuesService } from '../issues.service';

@Component({
  selector: 'app-issue-list',
  templateUrl: './issue-list.component.html',
  styleUrls: ['./issue-list.component.scss']
})
export class IssueListComponent implements OnInit, OnDestroy {
  issues: Issue[] = [];
  isLoading = false;
  private issuesSub: Subscription;

  pendingIssues: number;

  constructor(public issuesService: IssuesService) {}

  ngOnInit() {
    this.isLoading = true;
    this.issuesService.getIssues();
    this.issuesSub = this.issuesService
      .getIssueUpdateListener()
      .subscribe((issues: Issue[]) => {
        this.isLoading = false;
        this.issues = issues;
        this.pendingIssues = 0;
        this.issues.map(i => {
          if (i.status === false) {
            this.pendingIssues++;
          }
        });
      });
  }
  onDelete(issueId) {
    this.issuesService.deleteIssue(issueId);
  }

  ngOnDestroy() {
    this.issuesSub.unsubscribe();
  }
}
