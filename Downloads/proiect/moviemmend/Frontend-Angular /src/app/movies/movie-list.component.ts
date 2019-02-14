import { Component, OnInit, OnChanges, SimpleChanges } from '@angular/core';

import { Movie } from './movie';
import { MovieService } from '../_services/movie.service';
import { first } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';


@Component({
  templateUrl: './movie-list.component.html',
  styleUrls: ['./movie-list.component.css']
})
export class MovieListComponent implements OnInit {
  pageTitle = 'Rezultate';
  imageWidth = 150;
  imageMargin = 2;
  showImage = true;
  errorMessage = '';
  title: String;
  id: String;
  newAttendanceSet: any;
  search = "ceva";

  filteredMovies: Movie[] = [];
  movies: Movie[] = [];

  constructor(private movieService: MovieService,
    private route: ActivatedRoute) {
  }

  

  ngOnInit(): void { 
    this.route.params.forEach(param => {
      this.movieService.getMovies().subscribe(
      movies => {
        this.movies = movies;
        console.log(movies);
        this.filteredMovies = this.movies;
      },
      error => this.errorMessage = <any>error
    );})
    
  }
}
