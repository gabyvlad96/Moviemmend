import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';
import { environment } from '@environments/environment';
import { Router, ActivatedRoute } from '@angular/router';
import { MovieListComponent } from '../movies/movie-list.component'
import { Movie } from '../movies/movie';

@Injectable({
  providedIn: 'root'
})
export class MovieService {
  public id: String;
  public idRec: String;
  movies: Movie[] = [];
  arg: String;
  constructor(private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router) { }

  getMovieLink(nume: string) {
    this.arg = nume;
    console.log(nume);
    let formData: FormData = new FormData(); 
    formData.append('title', nume.toString());
    return this.http.post(`${environment.apiUrl}/search`, formData)
  }

  getMovieRec(id: number) { 
    let formData: FormData = new FormData(); 
    formData.append('user_id', id.toString());
    return this.http.post(`${environment.apiUrl}/title`, formData)
  }

  getMovie2() {
     return this.http.get(`${this.id}`)
  }

  getMovie3(){
    return this.http.get(`${this.idRec}`)
  }

  printMovies(){
    console.log(this.movies);   
      
    this.router.navigate([`/profile-search/${this.arg}`]);
    
  }


  getMovies(): Observable<Movie[]> {
    return of(this.movies);
  }

  getMovie(id: number): Observable<Movie | undefined> {
    console.log(this.movies)
    return this.getMovies().pipe(
      map((movies: Movie[]) => movies.find(p => p.id === id))
    );
  }

  private handleError(err: HttpErrorResponse) {
    // in a real world app, we may send the server to some remote logging infrastructure
    // instead of just logging it to the console
    let errorMessage = '';
    if (err.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      errorMessage = `An error occurred: ${err.error.message}`;
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      errorMessage = `Server returned code: ${err.status}, error message is: ${err.message}`;
    }
    console.error(errorMessage);
    return throwError(errorMessage);
  }
}
