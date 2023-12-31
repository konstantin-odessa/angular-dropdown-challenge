import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable, tap } from 'rxjs';
import { FormControl } from '@angular/forms';

type Pageable<T> = {
    results: T[];
}

type Movie = {
    id: number;
    title: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
    movieControl: FormControl<Movie> = new FormControl({
        id: 901362,
        title: 'Trolls Band Together'
    }, { nonNullable: true })

    items$!: Observable<Movie[]>;
    constructor(private readonly http: HttpClient) {}

    ngOnInit() {
        this.items$ = this.http.get<Pageable<Movie>>('https://api.themoviedb.org/3/movie/popular?api_key=1c27e642d8cedef632716f85732ec043').pipe(
            map((response) => response.results),
            tap(console.log),

        );

        this.movieControl.valueChanges.subscribe(console.log);
    }

    onSelected(item: Movie) {
        console.log('SELECTED MOVIE', item);
    }

}
