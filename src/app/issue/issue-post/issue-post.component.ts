import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { NgForm } from '@angular/forms';
import { IssuesService } from '../issues.service';
import { ActivatedRoute, ParamMap } from '@angular/router';

import { Issue, Comment } from '../issue.model';

@Component({
  selector: 'app-issue-post',
  templateUrl: './issue-post.component.html',
  styleUrls: ['./issue-post.component.scss']
})
export class IssuePostComponent implements OnInit, OnDestroy {
  checked: boolean;
  mode = 'create';
  private issueId: string;
  issue: Issue;
  isLoading = false;
  comment: Comment;
  file: File;
  private commentSub: Subscription;
  fileUploadProgress: string = null;

  constructor(
    public issueService: IssuesService,
    public route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.commentSub = this.issueService
      .getSingleIssueUpdateListener()
      .subscribe(issue => {
        this.issue = issue;
      });
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('issueId')) {
        this.mode = 'edit';
        this.issueId = paramMap.get('issueId');
        this.isLoading = true;
        this.issueService.getIssue(this.issueId).subscribe(issueData => {
          this.isLoading = false;
          this.issue = {
            id: issueData.id,
            description: issueData.description,
            status: issueData.status,
            issueFiles: issueData.issueFiles,
            comments: issueData.comments
          };
          this.checked = issueData.status;
        });
      } else {
        this.mode = 'create';
        this.issueId = null;
      }
    });
  }

  onSaveIssue(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.isLoading = true;
    if (this.mode === 'create') {
      this.issueService.addIssue(form.value.description);
    } else {
      this.issueService.updateIssue(
        this.issueId,
        form.value.description,
        this.checked
      );
    }
    form.resetForm();
  }

  onSaveComment(form: NgForm) {
    this.comment = {
      content: form.value.content
    };
    this.issueService.addComment(this.issueId, this.comment);
    form.resetForm();
  }

  onProgress(fileInput: any) {
    this.issueService.fileProgress(fileInput);
  }

  onUpload() {
    this.issueService.uploadFile(this.issueId);
  }

  onDownload(item) {
    this.issueService.downloadFile(this.issueId, item.name);
  }

  ngOnDestroy() {
    this.commentSub.unsubscribe();
  }
}
