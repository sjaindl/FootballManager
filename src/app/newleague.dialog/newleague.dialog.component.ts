import { Component, OnInit, Inject } from '@angular/core';
import { Validators, FormControl } from '@angular/forms';
import {  MatSnackBar } from '@angular/material/snack-bar';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SignInErrorStateMatcher } from '../shared/SignInErrorStateMatcher';
import { FirebaseService } from '../services/firebase.service';
import { AuthService } from '../services/auth.service';
import { League } from '../shared/League';
//import { SELECT_VALUE_ACCESSOR } from '@angular/forms/src/directives/select_control_value_accessor';
import { docData } from '@angular/fire/firestore';
import { Config } from '../shared/config';

@Component({
  selector: 'app-newleague-dialog',
  templateUrl: './newleague.dialog.component.html',
  styleUrls: ['./newleague.dialog.component.scss']
})
export class NewleagueDialogComponent implements OnInit {

  leagueFormControl = new FormControl('', [
    Validators.required,
    Validators.pattern('\\w+')
  ])

  passwordFormControl = new FormControl('', [
    Validators.required,
    Validators.minLength(6)
  ])

  hide = true
  matcher = new SignInErrorStateMatcher()

  constructor(public dialogRef: MatDialogRef<NewleagueDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private firebaseService: FirebaseService,
    private authService: AuthService,
    private snackBar: MatSnackBar) { }

  ngOnInit() {
  }
  
  createLeague() {
    var exists = true
    docData(this.firebaseService.getFoundedLeague(Config.curLeague, this.leagueFormControl.value)).subscribe(league => {
      if (league == null && exists == true) {
        exists = false
      }

      if (exists) {
        this.openSnackBar('Liga existiert bereits. Wähle einen anderen Liganamen', '')
      } else {
        this.firebaseService.addFoundedLeague(Config.curLeague, this.leagueFormControl.value, this.passwordFormControl.value).then(SELECT_VALUE_ACCESSOR => {
          console.log(SELECT_VALUE_ACCESSOR)
          this.firebaseService.addUserLeague(Config.curLeague, this.leagueFormControl.value)
          
          let league = new League()
          league.name = this.leagueFormControl.value
          this.authService.currentLeague = league
          this.dialogRef.close()
        }).catch(error =>  {
          this.openSnackBar('Fehler beim Liga gründen: ' + error, '')
          this.dialogRef.close()
        })
      }
    })
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }
}
