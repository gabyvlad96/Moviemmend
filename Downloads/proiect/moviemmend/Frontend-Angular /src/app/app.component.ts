import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { AuthenticationService } from './_services';
import { User } from './_models';
import { MovieService } from './_services';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Movie } from './movies/movie';
import { map, catchError } from 'rxjs/operators';
import { Observable } from 'rxjs';



@Component({ // selector: 'app', templateUrl: 'app.component.html' 
selector: 'pm-root',
  template: `
    <nav class='navbar navbar-expand-md  navbar-light bg-light'>
        <a class='navbar-brand' [routerLink]="['/welcome']">MOVIEMMEND</a>
        <ul class='navbar-nav'>
          <li class="nav-item active"><a class='nav-link' routerLinkActive='active' [routerLink]="['/welcome']">Acasa</a></li>
          <li *ngIf="currentUser"><a class='nav-link' routerLinkActive='active' [routerLink]="['/profile-rec']">Filme</a></li>
          <li *ngIf="currentUser"><a class="nav-item nav-link" (click)="logout()">Logout</a></li>

        </ul>
        <ul class="navbar-nav ml-auto" >
        <li class="nav-item" *ngIf="!currentUser">
            <a class='nav-link' routerLinkActive='active' [routerLink]="['/login']">Log In</a>
        </li>
       <li class="nav-item" *ngIf="currentUser">
            <a class='nav-link not-active'>{{currentUser.username}}</a>
       </li>
        </ul>
        <form class="form-inline" [formGroup]="searchForm" (ngSubmit)="onSubmit()">
      <div class="md-form my-0">
        <input class="form-control mr-sm-2" type="search" formControlName="search"
        placeholder="Search" aria-label="Search">
      </div>
    </form>
    </nav>

    

    <router-outlet></router-outlet>
    
    `,
  styleUrls: ['./app.component.css']

})
export class AppComponent {
    currentUser: User;
    submitted = false;
    searchForm: FormGroup;
    idStr: any;
    id: string;
    movies: Movie[] = [];
   



    constructor(
        private router: Router,
        private authenticationService: AuthenticationService,
        private formBuilder: FormBuilder,
        private movieService: MovieService

    ) {
        this.authenticationService.currentUser.subscribe(x => this.currentUser = x);
    }
   
    ngOnInit() {
        this.searchForm = this.formBuilder.group({
            search: [''],
        });
    }

    get f() { return this.searchForm.controls; }

    onSubmit() {
        this.submitted = true;

        // stop here if form is invalid
        if (this.searchForm.invalid) {
            return;
        }
 
        //this.loading = true;
        console.log(this.f.search.value);
        this.movieService.getMovieLink(this.f.search.value)
            .subscribe(response => {
              this.idStr = response['link']
              console.log(this.idStr);

              for (let index in this.idStr) {
                this.movieService.id = this.idStr[index];
                console.log(this.idStr[index]);
                this.movieService.getMovie2()
                      .subscribe(response => {

                        this.movies.push({
                            id : Number(index),
                            name : response['Title'],
                            releaseDate : response['Released'],
                            genres : response['Genre'],
                            description : response['Plot'],
                            starRating : response['imdbRating'],
                            imageUrl : response['Poster']
                          })  
                          if (Number(index) == this.idStr.length - 1) {
                                 this.mycallback(this.movies)
                          }

                        },
                        err => {console.error(err)
                     })
                      
              }    
              this.movies = [];

    })
    }

    mycallback(arr: Array<any>) {
        this.movieService.movies = arr;
        this.movieService.printMovies();
    }



    logout() {
        this.authenticationService.logout();
        this.router.navigate(['/login']);
    }


   

}