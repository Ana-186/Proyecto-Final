import { Component, OnInit} from '@angular/core';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FirebaseServiceService } from './services/firebase-service.service';
import { isNullOrUndefined } from 'util';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  closeResult = '';

  lapForm: FormGroup;

  idFirebaseActualizar: string;

  actualizar: boolean;

  constructor(
    private modalService: NgbModal,
    public fb: FormBuilder,
    private firebaseServiceService: FirebaseServiceService
    ) {}

 config:any;
 collection ={ count:20, data: []}
 ngOnInit(): void {
  this.actualizar = false;

  this.idFirebaseActualizar = "";

  this.config ={
    itemsPerPage: 5,
    currentPage: 1,
    totalItems: this.collection.count
  };

  this.lapForm = this.fb.group({
 
    id: ['', Validators.required],
    marca: ['', Validators.required],
    modelo: ['', Validators.required],
  });

  this.firebaseServiceService.getlaptop().subscribe(resp => {
    this.collection.data = resp.map((e: any) =>{
      return {
        id: e.payload.doc.data().id,
        marca: e.payload.doc.data().marca,
        modelo: e.payload.doc.data().modelo,
        idfirebase: e.payload.doc.id
      }
    })
  },
  error => {
    console.error(error);
  });
  

 }
 pageChanged(event){
  this.config.currentPage = event;
}

eliminar(item:any): void{
  this.firebaseServiceService.delatelaptop(item.idfirebase);
}

guardarEstudiante (): void{
  this.firebaseServiceService.createlaptop(this.lapForm.value).then(resp=>{
   
  this.lapForm.reset();
  this.modalService.dismissAll();
  }).catch(error => {
     console.error(error)
  })

}
actualizarEstudiante(){
    if(isNullOrUndefined(this.idFirebaseActualizar)){
      this.firebaseServiceService.updatelaptop( this.idFirebaseActualizar, this.lapForm.value).then(resp=>{
        this.lapForm.reset();
        this.modalService.dismissAll();
      }).catch(error=>{
        console.error(error);
      });
    }
  }
   
openeditar(content, item:any) {
  this.lapForm.setValue({
    id: item.id,
    marca: item.marca,
    modelo: item.modelo
  })
  this.idFirebaseActualizar=item.idfirebase
  this.actualizar= true;
  this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
    this.closeResult = `Closed with: ${result}`;
  }, (reason) => {
    this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
  });
}


open(content) {
  this.actualizar= false;
  this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
    this.closeResult = `Closed with: ${result}`;
  }, (reason) => {
    this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
  });
}

private getDismissReason(reason: any): string {
  if (reason === ModalDismissReasons.ESC) {
    return 'by pressing ESC';
  } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
    return 'by clicking on a backdrop';
  } else {
    return `with: ${reason}`;
  }
}
}
