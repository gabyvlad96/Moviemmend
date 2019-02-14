import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { MovieListComponent } from './movie-list.component';
import { MovieDetailComponent } from './movie-detail.component';
import { SharedModule } from '../shared/shared.module';
import { MovieRecComponent } from './movie-rec.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'profile-movies/:id',
        component: MovieDetailComponent
      },
      {
        path: 'profile-rec/:id',
        component: MovieDetailComponent
      }
    ]),
    SharedModule
  ],
  declarations: [
    MovieListComponent,
    MovieRecComponent,
    MovieDetailComponent,
  ]
})
export class MovieModule { }
