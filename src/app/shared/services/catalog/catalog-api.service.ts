import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Catalog } from '../../models';



const apiUrl = "http://localhost:8080/libraryManagmentApp/api/books/";

@Injectable({
  providedIn: 'root'
})
export class CatalogApiService {

  // pedidos ajax
  constructor(private http: HttpClient) { }

  public getCatalogDB() {

    return this.http.get('http://localhost:8080/libraryManagmentApp/api/books/');
  }

  public getCatalogById(id: number) {

    return this.http.get('http://localhost:8080/libraryManagmentApp/api/books/' + id);
  }

  public createBook(book: Catalog) {
    console.log("book : ", book);
    this.http.post(apiUrl, book).subscribe(
      (res) => { console.log("OK") },
      error => { console.error(error) });
  }

  public deleteBook(book: Catalog) {

    this.http.post(apiUrl, book.id).subscribe(
      (res) => { console.log("OK") },
      error => { console.error(error) });
  }
}








