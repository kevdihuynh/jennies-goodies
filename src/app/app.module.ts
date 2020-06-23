import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { environment } from '../environments/environment';

import { AngularFireModule } from '@angular/fire';
import { AngularFireAnalyticsModule } from '@angular/fire/analytics';
import { AngularFirestoreModule } from '@angular/fire/firestore';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavComponent } from './common/nav/nav.component';
import { FooterComponent } from './common/footer/footer.component';
import { AdminComponent } from './pages/admin/admin.component';
import { ProductsComponent } from './pages/products/products.component';
import { ProductComponent } from './pages/products/product/product.component';
import { OrderComponent } from './pages/products/order/order.component';
import { TimePickerComponent } from './pages/products/order/time-picker/time-picker.component';
import { DatePickerComponent } from './pages/products/order/date-picker/date-picker.component';
import { AngularFireFunctionsModule, ORIGIN } from '@angular/fire/functions';
import { HttpClientModule } from '@angular/common/http';
@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    FooterComponent,
    AdminComponent,
    ProductsComponent,
    ProductComponent,
    OrderComponent,
    TimePickerComponent,
    DatePickerComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase),
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    AngularFireFunctionsModule,
    HttpClientModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
