import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from '@environments/environment';
import { UserService, AuthenticationService } from '@app/_services';
import { User } from '@app/_models';
import { Subscription } from 'rxjs';
import { Movie } from './movie';
import { MovieService } from '../_services/movie.service';
import {Location} from '@angular/common';


@Component({
  templateUrl: './movie-detail.component.html',
  styleUrls: ['./movie-detail.component.css']
})
export class MovieDetailComponent implements OnInit {
  currentUser: User;
  currentUserSubscription: Subscription;
  errorMessage = '';
  showTextInput = false;
  radioData: number;
  movie: Movie | undefined;

  constructor(private route: ActivatedRoute,
    private router: Router,
    private _location: Location,
    private movieService: MovieService,
    private authenticationService: AuthenticationService,
    private http: HttpClient,
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

  ngOnInit() {
    this.radioData = 0;
    const param = this.route.snapshot.paramMap.get('id');
    if (param) {
      const id = +param;
      this.getMovie(id);
    }
  }

  getMovie(id: number) {
    this.movieService.getMovie(id).subscribe(
      movie => {
      this.movie = movie;
      console.log(movie);
      },
      error => this.errorMessage = <any>error);
  }

  onBack(): void {
    this._location.back();  }

  checkValue(event: any){
    this.showTextInput = !this.showTextInput;
    console.log(this.showTextInput);
    console.log(this.radioData);
 }

 sendRating(event: any){
   console.log("ID:")
  let formData: FormData = new FormData(); 
  formData.append('idu', this.currentUser.id.toString());
  formData.append('idf', this.currentUser.id.toString());
    formData.append('rating', this.radioData.toString());
      return this.http.post(`${environment.apiUrl}/rating`, formData)

}



}
 