import { Injectable } from '@angular/core';
import { CatalogApiService } from '../catalog/catalog-api.service';
import { ReplaySubject } from 'rxjs';
import { NgForm } from '@angular/forms';
import { AcountApiService } from '../account/account-api.service';
import { HistoryApiService } from '../history/history-api.service';
import { Catalog } from '../../models';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  // observable books
  public catalog$: ReplaySubject<any[]> = new ReplaySubject(1);
  // observable users
  public user$: ReplaySubject<any[]> = new ReplaySubject(1);
  // observable hisotry
  public history$: ReplaySubject<any[]> = new ReplaySubject(1);
  //  
  private catalog: any
  // object of add and remove favorites
  public objectToSend: Object;


  constructor(private catalogApi: CatalogApiService, private acountApi: AcountApiService, private historyApi: HistoryApiService) {
    this.getCatalog();
    this.getUsers();

  }

  /* BOOKS DATA LOGIC*/

  // Está função não está em uso
  public getCatalogById(id) {
    for (const item of this.catalog) {
      if (item.id === id) {
        return item;
      }
    }
  }
  public getCatalog() {
    this.catalogApi.getCatalogDB().subscribe(
      (res: any) => {
        this.catalog = res;
        this.catalog$.next(res);
      }
    );
  }
  public createCatalog(catalog) {
    this.catalogApi.createBook(catalog).subscribe(
      (res) => {
        console.log("OK");
        this.getCatalog();
      },
      error => { console.error(error) });
  }
  public updateCatalog(catalog) {
    console.log(catalog);
    this.catalogApi.updateBook(catalog);
  }

  public deleteCatalogService(id) {
    this.catalogApi.deleteBook(id).subscribe(
      (res) => {
        console.log("OK");
        this.getCatalog();
      },
      error => { console.error(error) });
  }

  /* USERS DATA LOGIC*/

  // getusers
  public getUsers() {
    this.acountApi.getUsersDB().subscribe(
      (res: any) => {
        console.log("OK");
        this.user$.next(res);
        console.log(this.user$);
      }
    );
  }

  //create users
  public createUser(user) {
    return this.acountApi.createUser(user)
  }

  // update user
  public updateUserServices(id, user) {
    this.acountApi.updateUser(id, user);
  }

  // change privileges
  public changePrivilegesServices(id) {
    console.log("data id: " + id);
    this.acountApi.changePrivilegesUser(id);
  }

  // disable user
  public disableServices(id) {
    console.log("data id: " + id);
    this.acountApi.disableUser(id);
  }
  // reactive user
  public reactivateServices(id) {
    console.log("data id: " + id);
    this.acountApi.reactivateUser(id);
  }

  // add to Favorite -- TESTAR COM URGÊNCIA --- é a maneira que encontrei para enviar dois objectos
  public addFavoritesServices(userID: number, bookID: number) {
    this.objectToSend = { 'userID': userID, 'bookID': bookID };
    this.acountApi.addBookToFavourites(this.objectToSend);
  }

  // remove from favorite
  public removeFavoritesServices(userID: number, bookID: number) {
    this.objectToSend = { 'userID': userID, 'bookID': bookID };
    this.acountApi.removeFavourite(this.objectToSend);
  }
  // get all favorites
  public getAllFavoritesServices(userID: number) {
    return this.acountApi.getAllFavourites(userID);
  }

  /* HISTORY DATA LOGIC*/

  // Reserve a Book
  public reserveBookService(reserve: History) {
    return this.historyApi.reserveBookHistory(reserve)
  }
  // Pickup book
  public pickupBookService(bookToPickUp: Catalog) {
    return this.historyApi.pickupBook(bookToPickUp);
  }
  // Deliver book
  public deliverBookService(bookToDeliver: Catalog) {
    return this.historyApi.deliverBook(bookToDeliver);
  }
  // User History
  public getUserHistoryService(userID: number) {
    return this.historyApi.getUserHistory(userID);
  }
  // User with Book
  public getUserWithBookService(bookID: number) {
    return this.historyApi.getUserWithBook(bookID);
  }
  // Book with User
  public getBookWithUserService(userID: number) {
    return this.historyApi.getBooksWithUser(userID);
  }
}

