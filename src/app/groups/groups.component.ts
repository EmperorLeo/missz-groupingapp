import { Component, OnInit } from '@angular/core';
import { GroupService } from '../core/group.service';
import { Grouping } from '../core/models/grouping';
import { Router } from '@angular/router';

@Component({
  selector: 'app-groups',
  templateUrl: './groups.component.html',
  styleUrls: ['./groups.component.scss']
})
export class GroupsComponent implements OnInit {

  groupings: Grouping[];

  constructor(private groupService: GroupService, private router: Router) { }

  ngOnInit() {
    this.groupService.getGroups().subscribe(groupings => {
      this.groupings = groupings;
    });
  }

  goToGrouping(groupingId: string) {
    this.router.navigate([groupingId]);
  }
}
