import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ToastrModule } from 'ngx-toastr';

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
import { CartComponent } from './common/cart/cart.component';
import { CartModalComponent } from './common/cart/cart-modal/cart-modal.component';
import { TimePickerComponent } from './common/cart/cart-modal/time-picker/time-picker.component';
import { DatePickerComponent } from './common/cart/cart-modal/date-picker/date-picker.component';
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
    CartComponent,
    CartModalComponent,
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
    BrowserAnimationsModule, // required animations module for ngx-toastr
    ToastrModule.forRoot({
      positionClass: 'toast-bottom-left',
      preventDuplicates: true,
      progressBar: true,
      disableTimeOut: true
    }),
  ],
  entryComponents: [],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
