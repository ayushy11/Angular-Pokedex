import { Component } from '@angular/core';
import { SearchService } from './search.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'angular-pokedex';

  constructor(private searchservice: SearchService) {}

  search(term: string) {
    this.searchservice.searchTerms = term;
    console.log('search term: ', term);
  }
}
