import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Gif, SearchResponse } from '../interfaces/gifs.interfaces';


@Injectable({
  providedIn: 'root'
})
export class GifsService {

  public gifList: Gif[] = [];

  private _tagsHistory: string[] = [];
  private apiKey:       string = '98J702Joisty6IMgjYfkH6yDfveGP6R3';
  private serviceUrl:   string = 'https://api.giphy.com/v1/gifs';

  constructor( private http: HttpClient ) {
    this.loadLocalStorage();
    console.log('Gifs Service ready')
  }

  get tagsHistory() {
    return [...this._tagsHistory];
  }

  private organizeHistory( tag: string ){
    tag = tag.trim().toLowerCase();
    if( this._tagsHistory.includes(tag) ){//filtrar la lista
      this._tagsHistory = this._tagsHistory.filter( (oldTag) => oldTag !== tag );
    }
    this._tagsHistory.unshift(tag);//inserta al principio el tag
    this._tagsHistory = this._tagsHistory.splice(0, 10);//restringe largo de lista
    this.saveLocalStorage();
  }

  private saveLocalStorage(): void {
    localStorage.setItem('history', JSON.stringify(this._tagsHistory));
  }

  private loadLocalStorage(): void {
    
    if( !localStorage.getItem('history') ) return;

    this._tagsHistory = JSON.parse( localStorage.getItem('history')! );
    
    if( this._tagsHistory.length === 0 ) return;
    
    this.searchTag(this._tagsHistory[0]);
  
  }


  searchTag( tag: string ): void {
    if (tag.trim().length === 0) return;

    // this._tagsHistory.unshift( tag );
    this.organizeHistory(tag);
    // console.log(this.tagsHistory); 

    // fetch('https://api.giphy.com/v1/gifs/search?api_key=98J702Joisty6IMgjYfkH6yDfveGP6R3&q=funny&limit=2')
    //   .then( resp => resp.json() )
    //   .then( data => console.log(data) );

    const params = new HttpParams()
      .set( 'api_key', this.apiKey )
      .set( 'q', tag )
      .set( 'limit', '10' );

    this.http.get<SearchResponse>(`${ this.serviceUrl }/search`, { params })
      .subscribe( resp => {

        this.gifList = resp.data;
        // console.log({ gifs: this.gifList });
      });

  }
  
}
