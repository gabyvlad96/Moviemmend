import { Component, OnInit } from '@angular/core';
import { Options } from 'ng5-slider';
import { ViewEncapsulation } from '@angular/core';
import { NgForm, FormBuilder, FormGroup } from '@angular/forms';
import { HttpClient,HttpErrorResponse} from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { MovieService } from '@app/_services';
import { Movie } from '@app/movies/movie';
import { User } from '@app/_models';
import { Router, ActivatedRoute } from '@angular/router';



declare const $; 

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json',
    'Authorization': 'my-auth-token'
  })
};


@Component({
  selector: 'pm-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class ProfileComponent implements OnInit {
  submitted = false;
  searchForm: FormGroup;
  idStr: any;
  movies: Movie[] = [];
  name1: any;
  name2: any;
  name3: any;



  constructor(private http: HttpClient,
    private formBuilder: FormBuilder,
    private movieService: MovieService,
    private route: ActivatedRoute,
    private router: Router
    ) { 
  }

  ngOnInit() {
    this.searchForm = this.formBuilder.group({
      search1: [''],
      search2: [''],
      search3: [''],

  });
  }

  get f() { return this.searchForm.controls; }


  value: number = 1970;
  highValue: number = 2000;
  options: Options = {
    floor: 1950,
    ceil: 2018,
    step: 5,
    showTicks: true

  };

  model = {
    comedie: false,
    scifi: false,
    actiune: false,
    horror: false,
    aventura: false,
    drama: false,
    romantic: false,
    animatie: false
  };
  private url = 'api/buttons/db.json';


////////////////////////////////
  onSubmit1() {
    this.submitted = true;
    // stop here if form is invalid
    if (this.searchForm.invalid) {
        return;
    }
    console.log("apel");

    //this.loading = true;
    console.log(this.f.search1.value);
    this.movieService.getMovieLink(this.f.search1.value)
        .subscribe(response => {
          this.idStr = response['link']
          console.log(this.idStr);
          this.movieService.id = this.idStr[0];
          this.movieService.getMovie2()
                  .subscribe(response => {
                        this.name1 = response['Title'];
                        this.mycallback(this.name1)
                      })  
                    
                      

                    },
                    err => {console.error(err)
                 })
                  
          }    
  mycallback(name: string) {
    console.log(name);
    this.name1 = name;
  }
///////////////////////////////////////////////////
  onSubmit2() {
  this.submitted = true;
  // stop here if form is invalid
  if (this.searchForm.invalid) {
      return;
  }
  console.log("apel");

  //this.loading = true;
  console.log(this.f.search2.value);
  this.movieService.getMovieLink(this.f.search2.value)
      .subscribe(response => {
        this.idStr = response['link']
        console.log(this.idStr);
        this.movieService.id = this.idStr[0];
        this.movieService.getMovie2()
                .subscribe(response => {
                      this.name2 = response['Title'];
                      this.mycallback2(this.name2);
                    })  
                  
                    

                  },
                  err => {console.error(err)
               })
                
        }    
mycallback2(name: string) {
  this.name2 = name;
}
//////////////////////////////////////////////
onSubmit3() {
  this.submitted = true;
  // stop here if form is invalid
  if (this.searchForm.invalid) {
      return;
  }
  console.log("apel");

  //this.loading = true;
  console.log(this.f.search3.value);
  this.movieService.getMovieLink(this.f.search3.value)
      .subscribe(response => {
        this.idStr = response['link']
        console.log(this.idStr);
        this.movieService.id = this.idStr[0];
        this.movieService.getMovie2()
                .subscribe(response => {
                      this.name3 = response['Title'];
                      this.mycallback3(this.name3);
                    })  
                  
                    

                  },
                  err => {console.error(err)
               })
                
        }    
mycallback3(name: string) {
  console.log(name);
  this.name3 = name;
}



onSubmitFinal() {
  this.submitted = true;
  // stop here if form is invalid
  if (this.searchForm.invalid) {
      return;
  }
  console.log('SUBMIT');
  this.router.navigate(['/profile-rec']);

}



}
