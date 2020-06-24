import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ToastrModule } from 'ngx-toastr';
import { NgxSpinnerModule } from 'ngx-spinner';
import { NgxPayPalModule } from 'ngx-paypal';

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
import { CartButtonComponent } from './common/cart-button/cart-button.component';
import { CartModalComponent } from './common/cart-button/cart-modal/cart-modal.component';
import { TimePickerComponent } from './common/cart-button/cart-modal/time-picker/time-picker.component';
import { DatePickerComponent } from './common/cart-button/cart-modal/date-picker/date-picker.component';
import { PaypalComponent } from './common/cart-button/cart-modal/paypal/paypal.component';
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
    CartButtonComponent,
    CartModalComponent,
    TimePickerComponent,
    DatePickerComponent,
    PaypalComponent
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
    ToastrModule.forRoot(),
    NgxSpinnerModule,
    NgxPayPalModule
  ],
  entryComponents: [],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
