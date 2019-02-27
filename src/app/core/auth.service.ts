import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { from, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  user: firebase.User;
  authState: Observable<firebase.User>;

  get authenticated(): boolean {
    return !!this.user;
  }

  get id(): string {
    return this.authenticated ? this.user.uid : null;
  }

  constructor(private firebaseAuth: AngularFireAuth) {
    this.authState = firebaseAuth.authState;

    this.authState.subscribe(user => {
      this.user = user;
      console.log('AuthState Changed: ', this.user);
    });
  }

  emailAndPasswordSignIn(email: string, password: string) {
    return from(this.firebaseAuth.auth.signInWithEmailAndPassword(email, password));
  }

  logout() {
    this.firebaseAuth.auth.signOut();
  }
}
