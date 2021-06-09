import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormControlDirective } from '@angular/forms';
import { UserI } from 'src/app/shared/models/user.interface';
import { AuthService } from 'src/app/shared/services/auth/auth.service';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  constructor(private authSvc: AuthService) { }

  public profileForm = new FormGroup({
    displayName: new FormControl('', Validators.required),
    email: new FormControl({value:'', disabled:true}, Validators.required),
    photoURL: new FormControl('', Validators.required),
  })


  ngOnInit(): void {
    this.authSvc.userData$.subscribe(user => {
      this.initValuesForm(user)
    })    
  }

  private initValuesForm(user : UserI):void{
    this.profileForm.patchValue({
      displayName:user.displayName,
      email:user.email,
      photoURL:user.photoURL
    })
  }

  onSaveUser(user:UserI):void{
    this.authSvc.saveUserProfile(user)
  }

}
