import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/shared/models/user';
import { DataService, AcountApiService } from 'src/app/shared/services';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  user: User = new User();
  public msg1: String;

  constructor(
    private dataService: DataService,
    private accountApi: AcountApiService,
    private router: Router,
    private translate: TranslateService
  ) { }

  ngOnInit() {
  }
  // public account: User = new User();

  onClose() {
    this.user.name = '';
    this.user.email = '';
    this.user.nip = '';
    this.user.password = '';
  }
  onSubmit() {
    if (
      this.user.name &&
      this.user.email &&
      this.user.nip &&
      this.user.password
    ) {
      this.dataService.createUser(this.user).subscribe(
        (resp: any) => {
          if (resp === null) {
            this.translate.get('Erro: Email já se encontra registado').subscribe((res: string) => {
              this.msg1 = res;
            });
          } else {
            this.accountApi.loginUserNg(resp.email, resp.password).subscribe(
              (res: any) => {
                if (res !== null) {
                  this.accountApi.setCurrentUser(res);

                  if (res.admin) {
                    this.router.navigate(['admin']);
                  } else {
                    this.router.navigate(['user']);
                  }
                }
              }
            );
          }
        }
      );
    } else {
      this.msg1 = 'Erro: todos os campos são de preenchimento obrigatório.';
    }
  }
}
