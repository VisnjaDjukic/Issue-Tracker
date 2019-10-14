import { Issue, Comment } from './issue.model';
import { environment } from '../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { saveAs } from 'file-saver';

@Injectable({ providedIn: 'root' })
export class IssuesService {
  private issues: Issue[] = [];
  private issuesUpdated = new Subject<Issue[]>();
  private issueUpdated = new Subject<Issue>();

  fileData: File = null;
  public progress: number;

  constructor(private http: HttpClient, private router: Router) {}

  getIssues() {
    this.http
      .get<{ count: number; issues: Issue[] }>(environment.apiUrl)
      .subscribe(issueData => {
        this.issues = issueData.issues;
        this.issuesUpdated.next([...this.issues]);
      });
  }

  getIssueUpdateListener() {
    return this.issuesUpdated.asObservable();
  }

  getSingleIssueUpdateListener() {
    return this.issueUpdated.asObservable();
  }

  getIssue(id: string) {
    return this.http.get<Issue>(environment.apiUrl + id);
  }

  addIssue(description: string) {
    const issue: Issue = {
      id: null,
      description,
      status: false,
      issueFiles: [],
      comments: []
    };
    this.http
      .post<{ message: string; createdIssue: any }>(environment.apiUrl, issue)
      .subscribe(responseData => {
        issue.id = responseData.createdIssue.id;
        this.issues.push(issue);
        this.issuesUpdated.next([...this.issues]);
        this.router.navigate(['/']);
      });
  }

  addComment(id: string, comment: Comment) {
    this.http
      .post(environment.apiUrl + id + '/comments', comment)
      .subscribe(() => {
        const toBeUpdatedIssue = this.issues.find(i => i.id === id);
        toBeUpdatedIssue.comments.push(comment);
        this.issueUpdated.next(toBeUpdatedIssue);
      });
  }

  fileProgress(fileInput: any) {
    this.fileData = fileInput.target.files[0] as File;
  }

  uploadFile(id: string) {
    const formData = new FormData();
    formData.append('issueFile', this.fileData);
    this.http
      .post(environment.apiUrl + id + '/uploads', formData)
      .subscribe(res => {
        const toBeUpdatedIssue = this.issues.find(i => i.id === id);
        const lastFile = (res as Issue).issueFiles[
          (res as Issue).issueFiles.length - 1
        ];
        toBeUpdatedIssue.issueFiles.push({
          name: lastFile.name,
          path: lastFile.path
        });
        this.issueUpdated.next(toBeUpdatedIssue);
        alert('Document is uploaded!');
      });
  }

  downloadFile(id: string, fileName) {
    const file = { name: fileName };
    this.http
      .post(environment.apiUrl + id + '/downloads', file, {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        }),
        responseType: 'blob'
      })
      .subscribe(res => {
        saveAs(res, fileName);
      });
  }

  updateIssue(id: string, description: string, status: boolean) {
    const updateIssue = [
      {
        propName: 'description',
        value: description
      },
      {
        propName: 'status',
        value: status
      }
    ];
    
    this.http
      .patch(environment.apiUrl + id, updateIssue)
      .subscribe(response => {
        this.router.navigate(['/']);
       console.log(response);
      });
  }

  deleteIssue(issueId: string) {
    this.http.delete(environment.apiUrl + issueId).subscribe(() => {
      this.issues = this.issues.filter(issue => issue.id !== issueId);
      this.issuesUpdated.next([...this.issues]);
    });
  }
}
