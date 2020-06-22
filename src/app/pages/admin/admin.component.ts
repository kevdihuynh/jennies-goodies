import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {
  products: Array<any>;
  constructor(firestore: AngularFirestore) {
    firestore.collection('products').valueChanges().subscribe((products) => {
      this.products = products;
    });
  }

  ngOnInit(): void {
  }

}
