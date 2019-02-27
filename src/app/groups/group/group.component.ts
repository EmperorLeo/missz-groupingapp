import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSelectionList, MatSlideToggleChange, MatSlideToggle } from '@angular/material';
import { GroupService } from '../../core/group.service';
import { Group } from '../../core/models/group';
import { AngularFirestore } from 'angularfire2/firestore';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-group',
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.scss']
})
export class GroupComponent implements OnInit {

  addPersonForm: FormGroup;
  generateForm: FormGroup;
  saveGroupingForm: FormGroup;
  people: string[];
  groups: Group[];
  groupingName: string;
  groupingId: string;
  private routeSub: Subscription;
  @ViewChild(MatSelectionList) selectionList: MatSelectionList;

  constructor(private formBuilder: FormBuilder, private groupService: GroupService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.people = [];
    this.addPersonForm = this.formBuilder.group({
      person: ['', Validators.required]
    });
    this.generateForm = this.formBuilder.group({
      groupSize: [null, [Validators.required, Validators.min(1)]],
      groupNumber: [null, [Validators.required, Validators.min(1)]]
    });
    this.saveGroupingForm = this.formBuilder.group({
      name: ''
    });

    this.generateForm.get('groupSize').disable();
    this.generateForm.get('groupNumber').enable();

    this.routeSub = this.route.params.subscribe(params => {
      if (params['id'] !== 'new') {
        this.groupingId = params['id'];
        this.groupService.getGroup(this.groupingId).subscribe(grouping => {
          this.groups = grouping.groups;
          this.saveGroupingForm.get('name').setValue(grouping.name);
          let people = []
          for (let group of this.groups) {
            people = people.concat(group.members);
          }
          this.people = people;
        });
      }
    });
  }

  addPerson() {
    if (!this.addPersonForm.valid) {
      return;
    }
    const person = this.addPersonForm.value.person;
    this.addPersonForm.reset();
    this.people.push(person);
  }

  deleteSelected() {
    const deleted = this.selectionList.selectedOptions.selected.map(x => x.value);
    // bad time complexity probably but whatever.
    this.people = this.people.filter(person => !deleted.includes(person));
  }

  generateGroups() {
    if (!this.generateForm.valid) {
      return;
    }
    const generateFormVal = this.generateForm.value;
    const groupSize = generateFormVal.groupSize;
    const groupNumber = generateFormVal.groupNumber;

    this.groups = this.groupService.generateGroups(this.people, groupSize, groupNumber);
    console.log(this.groups);
  }

  generateFormToggleChanged(event: MatSlideToggleChange) {
    if (event.checked) {
      this.generateForm.get('groupSize').enable();
      this.generateForm.get('groupNumber').disable();
      this.generateForm.get('groupNumber').setValue(null);
    } else {
      this.generateForm.get('groupSize').disable();
      this.generateForm.get('groupNumber').enable();
      this.generateForm.get('groupSize').setValue(null);
    }
    this.generateForm.markAsUntouched();
  }

  startImportNames() {
    const fileElement = document.createElement('input');
    fileElement.type = 'file';
    fileElement.accept = '.txt';
    fileElement.hidden = true;
    document.body.appendChild(fileElement);
    fileElement.click();

    fileElement.onchange = () => {
      const file = fileElement.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = _ => {
          const contents = <string>reader.result;
          var lines = contents.split('\n').filter(x => x.trim().length > 0);
          for (let line of lines) {
            // Again, this is not very performant for a large file, but is perfectly acceptable for this app.
            if (!this.people.includes(line)) {
              this.people.push(line);
            }
          }
          document.body.removeChild(fileElement);
        };
        reader.readAsText(file);  
      } else {
        document.body.removeChild(fileElement);
      }
    };
  }

  saveGrouping() {
    let name = this.saveGroupingForm.value.name;
    if (!name || name.trim().length == 0) {
      name = (new Date()).toString();
    }

    this.groupService.saveGroup(this.groupingId, name, this.groups);
  }
}
