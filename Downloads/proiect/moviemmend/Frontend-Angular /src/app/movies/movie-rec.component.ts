import { Component, OnInit, OnChanges, SimpleChanges } from '@angular/core';

import { Movie } from './movie';
import { MovieService } from '../_services/movie.service';
import { first } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { User } from '@app/_models';
import { Subscription } from 'rxjs';
import { UserService, AuthenticationService } from '@app/_services';



@Component({
  templateUrl: './movie-rec.component.html',
  styleUrls: ['./movie-rec.component.css']
})
export class MovieRecComponent implements OnInit {
  currentUser: User;
  currentUserSubscription: Subscription;
  pageTitle = 'Recomandari';
  imageWidth = 150;
  imageMargin = 2;
  showImage = true;
  errorMessage = '';
  title: String;
  id: String;
  newAttendanceSet: any;
  search: number;

  filteredMovies: Movie[] = [];
  movies: Movie[] = [];
    idStr: any;

  constructor(
    private movieService: MovieService,
    private authenticationService: AuthenticationService,
    private userService: UserService
    ) {
        this.currentUserSubscription = this.authenticationService.currentUser.subscribe(user => {
            this.currentUser = user;
        });
  }

  ngOnDestroy() {
    // unsubscribe to ensure no memory leaks
    this.currentUserSubscription.unsubscribe();
}
  



ngOnInit(): void { 

    console.log("A intrat");
        this.movieService.getMovieRec(this.currentUser.id)
            .subscribe(response => {
              this.idStr = response['link']
              console.log(this.idStr);
              for (let index in this.idStr) {
                this.movieService.idRec = this.idStr[index];
                this.movieService.getMovie3()
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
                        this.filteredMovies = this.movies;
                        this.mycallback(this.movies);

                        },
                        err => {console.error(err)
                     }) 
              }    
              this.movies = [];

    })
  }

  mycallback(arr: Array<any>) {
    this.movieService.movies = arr;
  }
}
