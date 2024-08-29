import { Component, OnInit } from '@angular/core';
import {HerbService} from "../../service/herb.service";
import {Herb} from "../../model/herb";
import {Router} from "@angular/router";
import {lastValueFrom} from "rxjs";
import {AddHerbDialogComponent} from "../../dialog/add-herb-dialog/add-herb-dialog.component";
import {HerbDto} from "../../dto/herb-dto";
import {MatDialog} from "@angular/material/dialog";
import {UpdateHerbDialogComponent} from "../../dialog/update-herb-dialog/update-herb-dialog.component";

@Component({
  selector: 'app-user-home',
  templateUrl: './user-home.component.html',
  styleUrls: ['./user-home.component.css']
})
export class UserHomeComponent implements OnInit {

  herbs: Herb[] = [];
  filteredHerbs: Herb[] = [];
  searchTerm: string = '';
  role!: string;
  isAdmin: boolean = false;
  p: number = 1;

  constructor(private readonly herbService: HerbService, private readonly router: Router, private readonly dialog: MatDialog) {}

  async ngOnInit(): Promise<void> {
    await this.getAllHerbs();
    await this.getUserRole();
    await this.setIsAdmin();
  }

  async getAllHerbs(): Promise<void> {
    const data = this.herbService.findAll();
    this.herbs = await lastValueFrom(data);
    this.filteredHerbs = this.herbs;
  }

  async getUserRole() : Promise<void> {
    this.role = localStorage.getItem('role') || '';
  }


  viewHerb(id: String) {
    this.router.navigate(['/herb', id]).then();
  }

  filterHerbs(): void {
    const term = this.searchTerm.toLowerCase();
    this.filteredHerbs = this.herbs.filter(herb =>
      herb.name.toLowerCase().includes(term) ||
      herb.description.toLowerCase().includes(term) ||
      herb.benefits.toLowerCase().includes(term)
    );
  }

  async setIsAdmin(){
    this.isAdmin = this.role === 'ADMIN';
  }

  deleteHerb(id: string){
    this.herbService.delete(id).subscribe();
    this.filteredHerbs = this.filteredHerbs.filter(herb => herb.id !== id);
  }

  openAddHerbDialog(): void {
    const dialogRef = this.dialog.open(AddHerbDialogComponent, {
      width: '500px'
    });

    dialogRef.afterClosed().subscribe((result: HerbDto | undefined) => {
      if (result) {
        this.herbService.create(result).subscribe(newHerb => {
          this.herbs.push(newHerb);
        });
      }
    });
  }

  openUpdateHerbDialog(herb: Herb): void {
    const dialogRef = this.dialog.open(UpdateHerbDialogComponent, {
      width: '500px',
      data: herb // Pass the herb data to the dialog
    });

    dialogRef.afterClosed().subscribe((updatedHerb: Partial<Herb> | undefined) => {
      if (updatedHerb) {
        const herbToUpdate = { ...herb, ...updatedHerb }; // Merge the updated fields with the existing herb
        this.herbService.update(herb.id, herbToUpdate).subscribe(() => {
          // Update the herb in the herbs array
          const index = this.herbs.findIndex(h => h.id === herb.id);
          if (index !== -1) {
            this.herbs[index] = herbToUpdate;
            this.filterHerbs(); // Apply the filter to update the displayed list
          }
        });
      }
    });
  }

}
