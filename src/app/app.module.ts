import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { OrderComponent } from './pages/order/order.component';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAnalyticsModule } from '@angular/fire/analytics';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { environment } from '../environments/environment';
import { AdminComponent } from './pages/admin/admin.component';
import { NavComponent } from './common/nav/nav.component';
import { FooterComponent } from './common/footer/footer.component';
import { CardComponent } from './common/card/card.component';

@NgModule({
  declarations: [
    AppComponent,
    OrderComponent,
    AdminComponent,
    NavComponent,
    FooterComponent,
    CardComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
