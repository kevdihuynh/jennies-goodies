import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ToastrModule } from 'ngx-toastr';
import { NgxSpinnerModule } from 'ngx-spinner';
import { NgxPayPalModule } from 'ngx-paypal';
import { QuillModule } from 'ngx-quill';

import { environment } from '../environments/environment';

import { AngularFireModule } from '@angular/fire';
import { AngularFireAnalyticsModule } from '@angular/fire/analytics';
import { AngularFirestoreModule } from '@angular/fire/firestore';


import { NgbToDatePipe } from './pipes/ngb-to-date/ngb-to-date.pipe';

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
import {AutocompleteLibModule} from 'angular-ng-autocomplete';
import { EditButtonComponent } from './common/edit-button/edit-button.component';
import { EditModalContentComponent } from './common/edit-button/edit-modal-content/edit-modal-content.component';
import { EditModalConfirmComponent } from './common/edit-button/edit-modal-confirm/edit-modal-confirm.component';

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
    PaypalComponent,
    NgbToDatePipe,
    EditButtonComponent,
    EditModalContentComponent,
    EditModalConfirmComponent
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
    NgxPayPalModule,
    AutocompleteLibModule,
    QuillModule.forRoot()
  ],
  entryComponents: [],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
