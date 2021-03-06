import { Injectable } from '@angular/core';
import { CatalogApiService } from '../catalog/catalog-api.service';
import { ReplaySubject } from 'rxjs';
import { NgForm } from '@angular/forms';
import { AcountApiService } from '../account/account-api.service';
import { HistoryApiService } from '../history/history-api.service';
import { Catalog, History } from '../../models';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  // observable books
  public catalog$: ReplaySubject<any[]> = new ReplaySubject(1);
  public book$: ReplaySubject<any[]> = new ReplaySubject(1);
  public catalogGroupedISBN$: ReplaySubject<any[]> = new ReplaySubject(1);
  // observable users
  public user$: ReplaySubject<any[]> = new ReplaySubject(1);
  // observable history
  public history$: ReplaySubject<any[]> = new ReplaySubject(1);
  public mostRead$: ReplaySubject<any[]> = new ReplaySubject(1);
  // 
  private users: any[] = [];
  // adicionei isto deixou de dar erro, na consola relativo ao admin management ----
  // ---- se alguma coisa com os users estiver a dar erro pode ser daqui
  public user: any;
  private catalog: any;
  public history: any[];
  // object of add and remove favorites
  public objectToSend: Object;
  //
  public search$: ReplaySubject<any[]> = new ReplaySubject(1);
  public search: any;

  public searchCatalog$: ReplaySubject<any[]> = new ReplaySubject(1);
  public searchUser$: ReplaySubject<any[]> = new ReplaySubject(1);

  constructor(private catalogApi: CatalogApiService, private acountApi: AcountApiService, private historyApi: HistoryApiService) {
    this.getCatalogByIsbn();
    this.getUsers();
  }

  /* BOOKS DATA LOGIC*/

  public getCatalog() {
    this.catalogApi.getCatalogDB().subscribe(
      (res: any) => {
        this.catalog = res;
        this.catalog$.next(res);
      }
    );
  }

  public getCatalogByIsbn() {
    this.catalogApi.getCatalogIsbn().subscribe(
      (res: any) => {
        this.catalog = res;
        this.catalog$.next(res);
      }
    );
    return this.catalog$;
  }

  // a data chega ao html já selecionada para entrar no html
  /* Get Catalog With Grouped Books by same Isbn*/
  public getCatalogGroupedByIsbn() {
    const data = [];
    this.catalogApi.getCatalogIsbn().subscribe(
      (res: any) => {
        res.forEach(element => {
          if (element.availableBooksWithThisIsbn[0]) {
            data.push(element.availableBooksWithThisIsbn[0]);
          } else {
            data.push(element.unavailableBooksWithThisIsbn[0]);
          }
        });
        this.catalogGroupedISBN$.next(data);
      }
    );
    return this.catalogGroupedISBN$;
  }

  public createCatalog(catalog) {
    this.catalogApi.createBook(catalog).subscribe(
      (res) => {
        console.log("OK");
        this.getCatalog();
      },
      error => { console.error(error); });
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
      error => { console.error(error); });
  }
  // Está função não está em uso --- ver se está, senão modificar
  public getCatalogById(id) {
    for (const item of this.catalog) {
      if (item.id === id) {
        return item;
      }
    }
  }
  public getCatalogIsbn(isbn) {
    for (const item of this.catalog) {
      if (item.isbn === isbn) {
        return item;
      }
    }
  }
  public getCatalogIdService(id) {
    return this.catalogApi.getCatalogById(id);
  }

  public getCatalogId(bookid) {
    this.catalogApi.getCatalogById(bookid).subscribe((res: any) => {
      this.book$.next(res);
    });
    return this.book$;
  }

  // Get all available books
  public getAvailableBooksService() {
    return this.catalogApi.getAvailableBooks();
  }


  // Switch Search -- tentar encurtar o metodo
  public queryCatalog(searchableList, input) {
    console.log(searchableList);
    console.log(input);
    switch (searchableList) {
      case 'keyword':
        const data = [];
        this.catalogApi.getCatalogByKeyword(input).subscribe(
          (res: any) => {
            res.forEach(element => {
              if (element.availableBooksWithThisIsbn[0]) {
                data.push(element.availableBooksWithThisIsbn[0]);
              } else {
                data.push(element.unavailableBooksWithThisIsbn[0]);
              }
              this.searchCatalog$.next(data);
            });
            return this.searchCatalog$;
          });
        break;
      case 'title':
      this.catalogApi.getCatalogByTitle(input).subscribe(
        (res: any) => {
          const title = [];
          res.forEach(element => {
            if (element.availableBooksWithThisIsbn[0]) {
              title.push(element.availableBooksWithThisIsbn[0]);
            } else {
              title.push(element.unavailableBooksWithThisIsbn[0]);
            }
            this.searchCatalog$.next(title);
          });
          return this.searchCatalog$;
        }
      );
        break;
      case 'author': this.catalogApi.getCatalogByAuthor(input).subscribe(
        (res: any) => {
          const author = [];
          res.forEach(element => {
            if (element.availableBooksWithThisIsbn[0]) {
              author.push(element.availableBooksWithThisIsbn[0]);
            } else {
              author.push(element.unavailableBooksWithThisIsbn[0]);
            }
            this.searchCatalog$.next(author);
          });
          return this.searchCatalog$;
        }
      );
        break;
      case 'description': this.catalogApi.getCatalogByDescription(input).subscribe(
        (res: any) => {
          const description = [];
          res.forEach(element => {
            if (element.availableBooksWithThisIsbn[0]) {
              description.push(element.availableBooksWithThisIsbn[0]);
            } else {
              description.push(element.unavailableBooksWithThisIsbn[0]);
            }
            this.searchCatalog$.next(description);
          });
          return this.searchCatalog$;
        }
      );
        break;
      case 'isbn': this.catalogApi.getCatalogByIsbn(input).subscribe(
        (res: any) => {
          const isbn = [];
          res.forEach(element => {
            if (element.availableBooksWithThisIsbn[0]) {
              isbn.push(element.availableBooksWithThisIsbn[0]);
            } else {
              isbn.push(element.unavailableBooksWithThisIsbn[0]);
            }
            this.searchCatalog$.next(isbn);
          });
          return this.searchCatalog$;
        }
      );
        break;
      case 'topic': this.catalogApi.getCatalogByTopic(input).subscribe(
        (res: any) => {
          const topic = [];
          res.forEach(element => {
            if (element.availableBooksWithThisIsbn[0]) {
              topic.push(element.availableBooksWithThisIsbn[0]);
            } else {
              topic.push(element.unavailableBooksWithThisIsbn[0]);
            }
            this.searchCatalog$.next(topic);
          });
          return this.searchCatalog$;
        }
      );
        break;
      default:
        console.error('Erro!');
        break;
    }
    return this.searchCatalog$;
  }


  // query para os cards dos users/
  public queryCatalogUsers(searchableList, input) {
    switch (searchableList) {
      case 'keyword':
        this.catalogApi.getCatalogByKeyword(input).subscribe(
          (res: any) => {
            return this.searchCatalog$.next(res);
          });
        break;
      case 'title': this.catalogApi.getCatalogByTitle(input).subscribe(
        (res: any) => {
          return this.searchCatalog$.next(res);
        }
      );
        break;
      case 'author': this.catalogApi.getCatalogByAuthor(input).subscribe(
        (res: any) => {
          return this.searchCatalog$.next(res);
        }
      );
        break;
      case 'description': this.catalogApi.getCatalogByDescription(input).subscribe(
        (res: any) => {
          return this.searchCatalog$.next(res);
        }
      );
        break;
      case 'isbn': this.catalogApi.getCatalogByIsbn(input).subscribe(
        (res: any) => {
          return this.searchCatalog$.next(res);
        }
      );
        break;
      case 'topic': this.catalogApi.getCatalogByTopic(input).subscribe(
        (res: any) => {
          return this.searchCatalog$.next(res);
        }
      );
        break;
      default:
        console.error('Erro!');
        break;
    }
    return this.searchCatalog$;
  }

  public getBookInfoGoogleApi(insertedTitle) {
    return this.catalogApi.getBookInfoGoogleApi(insertedTitle);
  }

  public getBookIsbnGoogleApi(isbn) {
    return this.catalogApi.getBookIsbnGoogleApi(isbn);
  }
  public getBookAuthorGoogleApi(isbn) {
    return this.catalogApi.getBookAuthorGoogleApi(String(isbn));
  }


  /* USERS DATA LOGIC*/

  // getusers


  public getUserById(id) {
    for (const item of this.users) {
      if (item.id === id) {
        return item;
      }
    }
  }

  public getTheUser(id) {
    this.acountApi.queryUserID(id).subscribe(
      (res: any) => {
        this.user.next(res);
        console.log(res);
      });
  }

  public getUsers() {
    this.acountApi.getUsersDB().subscribe(
      (res: any) => {
        this.user$.next(res);
        this.users = res;
        this.user = res;
      }
    );
  }

  // create users
  public createUser(user) {
    return this.acountApi.createUser(user);
  }

  // update user
  public updateUserServices(id, user) {
    return this.acountApi.updateUser(id, user);
  }

  /*PRIVILEGES OF USER --- Sem subscribe não funciona ---*/

  // change privileges
  public changePrivilegesServices(id) {
    return this.acountApi.changePrivilegesUser(id);
  }
  // disable user
  public disableServices(id) {
    return this.acountApi.disableUser(id);
  }
  // reactive user
  public reactivateServices(id) {
    return this.acountApi.reactivateUser(id);
  }

  // add to Favorite
  public addFavoritesServices(userID: number, bookIsbn: any) {
    return this.acountApi.addBookToFavourites(userID, bookIsbn);
  }

  // remove from favorite
  public removeFavoritesServices(userID: number, isbn: any) {
    return this.acountApi.removeFavourite(userID, isbn);
  }
  // get all favorites
  public getAllFavoritesServices(userID: number) {
    return this.acountApi.getAllFavourites(userID);
  }
  // Find By Id ???
  public queryUserIDServices(userID) {
    this.acountApi.queryUserID(userID).subscribe(
      (res: any) => {
        console.log('OK');
        this.user$.next(res);
        console.log(this.user$);
      }
    );

  }

  // Switch Search
  public queryUser(searchableList, input) {
    console.log('tipo:' + searchableList + 'input:' + input);
    switch (searchableList) {
      case 'name': this.acountApi.queryUserName(input).subscribe(
        (res: any) => {
          return this.searchUser$.next(res);
        }
      );
        break;
      case 'nip': this.acountApi.queryUserNip(input).subscribe(
        (res: any) => {
          return this.searchUser$.next(res);
        }
      );
        break;
      case 'email': this.acountApi.queryUserEmail(input).subscribe(
        (res: any) => {
          return this.searchUser$.next(res);
        }
      );
        break;
      default:
        console.error('Erro!');
        break;
    }
    return this.searchUser$;
  }

  /* HISTORY DATA LOGIC*/

  // Reserve a Book
  public reserveBookService(reserve: any) {
    return this.historyApi.reserveBookHistory(reserve);
  }

  // cancel book reserve
  public cancelReserveBookService(userID: number, bookID: number) {
    return this.historyApi.cancelReservation(userID, bookID);
  }

  // Pickup book
  public pickupBookService(bookToPickUp: any) {
    return this.historyApi.pickupBook(bookToPickUp);
  }
  // Deliver book
  public deliverBookService(bookToDeliver: any) {
    return this.historyApi.deliverBook(bookToDeliver);
  }
  // User History
  public getUserHistoryService(userID: number) {
    this.historyApi.getUserHistory(userID).subscribe(
      (res: any) => {
        this.history$.next(res);
        this.history = res;
      }
    );
    return this.history$;
  }

  // All History
  public getHistoryService() {
    this.historyApi.getHistory().subscribe(
      (res: any) => {
        this.history$.next(res);
        this.history = res;
      }
    );
    return this.history$;
  }
  // User with Book
  public getUserWithBookService(bookID: number) {
    return this.historyApi.getUserWithBook(bookID);
  }
  // Book with User
  public getBookWithUserService(userID: number) {
    return this.historyApi.getBooksWithUser(userID);
  }
  // Most Read Books
  public mostReadBook() {
    const data = [];
    this.historyApi.getMoreReads().subscribe(
      (res: any) => {
        res.forEach(element => {
          if (element.availableBooksWithThisIsbn[0]) {
            data.push(element.availableBooksWithThisIsbn[0]);
          } else {
            data.push(element.unavailableBooksWithThisIsbn[0]);
          }
          return this.mostRead$.next(data);
        });
      }
    );
    return this.mostRead$;
  }
}
