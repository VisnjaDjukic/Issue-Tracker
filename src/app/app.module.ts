import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import {
  MatInputModule,
  MatCardModule,
  MatButtonModule,
  MatToolbarModule,
  MatExpansionModule,
  MatProgressSpinnerModule,
  MatDividerModule,
  MatListModule,
  MatProgressBarModule,
  MatCheckboxModule,
  MatIconModule,
  MatBadgeModule
} from '@angular/material';

import { AppComponent } from './app.component';
import { IssueListComponent } from './issue/issue-list/issue-list.component';
import { IssuePostComponent } from './issue/issue-post/issue-post.component';
import { HeaderComponent } from './header/header.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';

@NgModule({
  declarations: [
    AppComponent,
    IssuePostComponent,
    IssueListComponent,
    HeaderComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    MatInputModule,
    MatCardModule,
    MatButtonModule,
    MatToolbarModule,
    MatExpansionModule,
    MatProgressSpinnerModule,
    MatDividerModule,
    MatListModule,
    MatProgressBarModule,
    MatCheckboxModule,
    MatIconModule,
    MatBadgeModule,
    BrowserAnimationsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
