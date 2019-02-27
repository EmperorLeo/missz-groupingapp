import { Injectable } from '@angular/core';
import { Group } from './models/group';
import { AngularFirestore } from 'angularfire2/firestore';
import { Router } from '@angular/router';
import { from, Observable } from 'rxjs';
import { Grouping } from './models/grouping';
import { AuthService } from './auth.service';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class GroupService {

  constructor(private firestore: AngularFirestore, private router: Router, private authService: AuthService) { }

  generateGroups(people: string[], size: number = null, num: number = null): Group[] {
    // You never know what terrible mistakes I could make if I didn't copy the array.
    const copy = people.slice(0);
    // TODO - this should not take in size - it should take in number of groups
    for (let i = 0; i < copy.length; i++) {
      const val1 = copy[i];
      const randomIndex = Math.floor((Math.random() * copy.length));
      const val2 = copy[randomIndex];
      copy[i] = val2;
      copy[randomIndex] = val1;
    }

    let numGroups = num;
    if (!numGroups) {
      numGroups = Math.ceil(copy.length / size);
    }
    const groups: Group[] = [];
    for (let i = 0; i < numGroups; i++) {
      groups.push(new Group());
    }

    for (let i = 0; i < copy.length; i++) {
      const groupNum = i % numGroups;
      groups[groupNum].members.push(copy[i]);
    }

    return groups;
  }

  saveGroup(groupingId: any, name: string, groups: Group[]) {
    const collection = this.firestore.collection('usergroupings').doc(this.authService.user.uid).collection('groupings');

    if (groupingId) {
      const doc = collection.doc(groupingId);
      from(doc.update({
        name: name,
        groups: groups.map(g => Object.assign({}, g))
      })).subscribe(res => {
        this.router.navigate(['/']);
      }, err => {
        console.log(err);
      });  
    } else {
      from(collection.add({
        name: name,
        groups: groups.map(g => Object.assign({}, g))
      })).subscribe(res => {
        this.router.navigate(['/']);
      }, err => {
        console.log(err);
      });  
    }
  }

  getGroups(): Observable<Grouping[]> {
    const collection = this.firestore.collection('usergroupings').doc(this.authService.user.uid).collection('groupings');
    return collection.get().pipe(
      map(x => x.docs.map(d => new Grouping(d.id, d.data().name, d.data().groups)))
    );
  }

  getGroup(groupingId: string): Observable<Grouping> {
    const doc = this.firestore.collection('usergroupings').doc(this.authService.user.uid).collection('groupings').doc(groupingId);
    return doc.get().pipe(
      map(d => new Grouping(d.id, d.data().name, d.data().groups))
    );
  }
}
