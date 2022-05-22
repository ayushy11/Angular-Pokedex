import { Component, Input, OnInit } from '@angular/core';
import { switchMap, tap, filter } from 'rxjs';
import { SearchService } from 'src/app/search.service';
import { PokeapiService, PokemonDetails } from '../../pokeapi/pokeapi.service';

@Component({
  selector: 'app-pokemons',
  templateUrl: './pokemons.component.html',
  styleUrls: ['./pokemons.component.css'],
})
export class PokemonsComponent implements OnInit {
  fetching = true;
  pokeTerm: string = '';

  @Input() term: string = '';

  pokedex$ = this.pokeapi.pokemons$.pipe(
    tap((data) => {
      console.log('final pokedex data', data);
      this.fetching = false;
    })
  );

  // filterdex$ = this.pokeapi.pokemons$.pipe(
  //   tap((data) => {
  //     data.filter((pokemon) =>
  //       pokemon.name
  //         .toLowerCase()
  //         .includes(this.searchService.searchTerms.toLowerCase())
  //     );
  //     console.log('Filtered Data:', data);
  //   })
  // );

  constructor(
    private pokeapi: PokeapiService,
    private searchService: SearchService
  ) {
    // this.getTerm();
    console.log('!!!!!!!', this.term);
  }

  ngOnInit(): void {}

  // getTerm() {
  //   this.searchService.searchTerms.pipe(
  //     tap((term: string) => {
  //       this.pokeTerm = term;
  //     })
  //   );
  // }

  onNext(event: any) {
    // console.log('event', event.srcElement);
    if (!this.fetching)
      if (
        event.srcElement &&
        event.srcElement.scrollTop >
          ((event.srcElement.scrollHeight - event.srcElement.offsetHeight) *
            8) /
            10
      ) {
        this.fetching = true;
        this.pokeapi.get_next();
      }
  }

  trackPokemon(index: number, pokemon: PokemonDetails): number {
    return pokemon.id;
  }
}
