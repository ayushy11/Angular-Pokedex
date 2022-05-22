import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { PokeapiService, PokemonDetails } from '../../pokeapi/pokeapi.service';

@Component({
  selector: 'app-pokemon-detail',
  templateUrl: './pokemon-detail.component.html',
  styleUrls: ['./pokemon-detail.component.css'],
})
export class PokemonDetailComponent implements OnInit {
  id: number = Number(this.route.snapshot.paramMap.get('id'));

  pokedex$ = this.pokeapi.pokemons$;
  pokeData$!: PokemonDetails[];

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private pokeapi: PokeapiService
  ) {
    this.pokedex$.subscribe(
      (data) =>
        (this.pokeData$ = data.filter((pokemon) => pokemon.id === this.id))
    );
    console.log('details data', this.pokeData$);
  }

  ngOnInit(): void {}

  goBack(): void {
    this.location.back();
  }
}
