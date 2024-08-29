import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {GroupService} from "../../service/group.service";
import {GroupDto} from "../../dto/group-dto";

@Component({
  selector: 'app-add-group-dialog',
  templateUrl: './add-group-dialog.component.html',
  styleUrls: ['./add-group-dialog.component.css']
})
export class AddGroupDialogComponent {
  form: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<AddGroupDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { locationId: string },
    private formBuilder: FormBuilder,
    private readonly groupService: GroupService
  ) {
    this.form = this.formBuilder.group({
      description: ['', Validators.required],
      gatheringTime: ['', Validators.required],
      locationId: [data.locationId, Validators.required]
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    if (this.form.valid) {
      const gatheringTime = new Date(this.form.get('gatheringTime')?.value);
      const now = new Date();

      if (gatheringTime < now) {
        alert('Gathering time cannot be in the past!');
        return;
      }

      const groupDto: GroupDto = {
        description: this.form.get('description')?.value,
        gatheringTime: this.form.get('gatheringTime')?.value,
        locationId: this.form.get('locationId')?.value
      };

      this.groupService.create(groupDto).subscribe(() => {
        this.dialogRef.close();
      });
    }
  }
}
