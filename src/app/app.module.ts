import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { ModalModule } from 'ngx-bootstrap';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { PanelComponent } from './shared/components/panel/panel.component';
import { AdminManagementComponent } from './shared';





@NgModule({
  declarations: [
    AppComponent
  
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ModalModule.forRoot()

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
