import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  BehaviorSubject,
  combineLatest,
  Observable,
  of,
  switchMap,
  tap,
} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PokeapiService {
  private API_LIMIT = 36;
  private api_url!: string;

  pokemons$ = new BehaviorSubject<PokemonDetails[]>([]);

  constructor(private http: HttpClient) {
    this.api_url = `https://pokeapi.co/api/v2/pokemon?offset=0&limit=${this.API_LIMIT}`;
    this.get_next();
  }

  /**
   *  Fetches the pokemon API response and sends pokemon results for getting each pokemon's details using switchMap from RxJS.
   * @returns Observable<PokemonDetails[]>
   */
  get_pokemons(): Observable<PokemonDetails[]> {
    return this.api_url
      ? this.http.get<PokemonApiResponse>(this.api_url).pipe(
          // perform a side effect for every emission on source observable
          tap((data) => {
            console.log(
              'next interval of pokemons with given limit',
              data.next
            );
            this.api_url = data.next;
          }),
          // switch to new Observable each time the data changes
          switchMap(
            (data) => (
              console.log('switchmap data', data),
              this.fetchPokemonData(data.results)
            )
          )
        )
      : of([]);
  }

  /**
   * Sets the next value of pokemons$ by using concat method on pokemons$ previous value.
   */
  get_next(): void {
    this.get_pokemons().subscribe(
      (newdata) => (
        console.log('get next (return by fetch with details )', newdata),
        this.pokemons$.next(this.pokemons$.value.concat(newdata)),
        console.log('then concat with new data of pokemons', this.pokemons$)
      )
    );
  }

  /**
   *  Combines API response with new fetched data of particular pokemon details using combineLatest from RxJS.
   * @param pokemons
   * @returns Observable<PokemonDetails[]>
   */
  private fetchPokemonData(
    pokemons: PokemonApiResponseResult[]
  ): Observable<PokemonDetails[]> {
    console.log('poke without details', pokemons);
    console.log(
      'subscribe to combinelatest',
      combineLatest(
        pokemons.map((pokemon) => this.http.get<PokemonDetails>(pokemon.url))
      ).subscribe((data) => console.log('poke with details', data))
    );
    return combineLatest(
      pokemons.map((pokemon) => this.http.get<PokemonDetails>(pokemon.url))
    );
  }
}

export interface Stat2 {
  name: string;
  url: string;
}

export interface Stat {
  base_stat: number;
  effort: number;
  stat: Stat2;
}

export interface Type2 {
  name: string;
  url: string;
}

export interface Type {
  slot: number;
  type: Type2;
}

export interface Other {
  home: { front_default: string; front_shiny: string };
}

export interface Sprites {
  front_shiny: string;
  other: Other;
}

export interface PokemonApiResponse {
  count: number;
  next: string;
  previous?: any;
  results: PokemonApiResponseResult[];
}

export interface PokemonApiResponseResult {
  name: string;
  url: string;
}

export interface PokemonDetails {
  id: number;
  name: string;
  height: number;
  weight: number;
  sprites: Sprites;
  stats: Stat[];
  types: Type[];
  species: {
    name: string;
    url: string;
  };
}
