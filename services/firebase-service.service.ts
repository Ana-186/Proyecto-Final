
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class FirebaseServiceService {

  constructor(
    private firestore: AngularFirestore
  ) { }

  getlaptop(){
  return this.firestore.collection("laptop").snapshotChanges();
  }

  createlaptop(laptops:any){
    return this.firestore.collection("laptop").add(laptops);
  }

  updatelaptop(id, laptops:any){
    return this.firestore.collection("laptop").doc(id).update(laptops);
  }

  delatelaptop(id:any){
    return this.firestore.collection("laptop").doc(id).delete();
  }
}