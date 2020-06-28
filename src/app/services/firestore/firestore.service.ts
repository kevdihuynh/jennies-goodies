import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

  constructor(
    private db: AngularFirestore,
    private toastrService: ToastrService
  ) { }

  async post(collection: string, doc: string, data: any): Promise<void> {
    return this.db.collection(collection).doc(doc).set(data);
  }
}
