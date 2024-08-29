import {Component, Inject} from '@angular/core';
import {Herb} from "../../model/herb";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {FormBuilder, FormGroup} from "@angular/forms";

@Component({
  selector: 'app-update-herb-dialog',
  templateUrl: './update-herb-dialog.component.html',
  styleUrls: ['./update-herb-dialog.component.css']
})
export class UpdateHerbDialogComponent {
  herbForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<UpdateHerbDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Herb
  ) {
    // Initialize form with existing herb data
    this.herbForm = this.fb.group({
      name: [data.name],
      description: [data.description],
      benefits: [data.benefits]
    });
  }

  onSave(): void {
    if (this.herbForm.valid) {
      this.dialogRef.close(this.herbForm.value);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
