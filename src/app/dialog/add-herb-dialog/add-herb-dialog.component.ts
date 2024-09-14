import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { Map, View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import Point from 'ol/geom/Point';
import { Feature } from 'ol';
import { fromLonLat } from 'ol/proj';
import { Style, Icon } from 'ol/style';
import { HerbDto } from "../../dto/herb-dto";
import {HerbService} from "../../service/herb.service";
import {ImageDto} from "../../dto/image-dto";

@Component({
  selector: 'app-add-herb-dialog',
  templateUrl: './add-herb-dialog.component.html',
  styleUrls: ['./add-herb-dialog.component.css']
})
export class AddHerbDialogComponent implements OnInit {
  herbForm!: FormGroup;
  map!: Map;
  availableSeasons: string[] = ['SPRING', 'SUMMER', 'AUTUMN', 'WINTER'];
  vectorSource = new VectorSource();
  selectedFile: File | null = null;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<AddHerbDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private herbService: HerbService  // Use the service to save image
  ) {}

  ngOnInit(): void {
    this.herbForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      seasons: [[], Validators.required],
      benefits: ['', Validators.required],
      locations: this.fb.array([]),
      imageUrl: ['']  // Add an imageUrl form control
    });

    this.initializeMap();
  }

  get locations(): FormArray {
    return this.herbForm.get('locations') as FormArray;
  }

  addLocation(x: string, y: string): void {
    this.locations.push(this.fb.group({ x: [x], y: [y] }));
  }

  initializeMap(): void {
    this.map = new Map({
      target: 'map',
      layers: [
        new TileLayer({
          source: new OSM()
        }),
        new VectorLayer({
          source: this.vectorSource
        })
      ],
      view: new View({
        center: fromLonLat([23.3219, 42.6977]), // Centered on Sofia
        zoom: 14
      })
    });

    this.map.on('click', (event) => {
      const coordinate = event.coordinate;
      const lonLat = coordinate.map(coord => coord.toFixed(6));

      // Add pin to map
      const point = new Feature({
        geometry: new Point(coordinate)
      });

      point.setStyle(new Style({
        image: new Icon({
          src: 'https://cdn-icons-png.flaticon.com/512/854/854866.png',
          scale: 0.08,
          anchor: [0.5, 1]
        })
      }));

      this.vectorSource.addFeature(point);

      // Add location to form
      this.addLocation(lonLat[0], lonLat[1]);
    });
  }

  onImageSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      this.herbService.uploadImage(file).subscribe(
        (imageDto: ImageDto) => {
          // Once the image is uploaded, save the imageUrl to the form
          this.herbForm.patchValue({ imageUrl: imageDto.imageUrl });
          console.log('Image uploaded successfully:', imageDto.imageUrl);
        },
        (error) => {
          console.error('Error uploading image:', error);
        }
      );
    }
  }

  onSave(): void {
    if (this.herbForm.valid) {
      const herbDto: HerbDto = this.herbForm.value;

      if (this.selectedFile) {
        // Upload the image using the HerbService
        this.herbService.uploadImage(this.selectedFile).subscribe(
          (imageDto: ImageDto) => {
            // Set the imageUrl in herbDto after the image upload succeeds
            herbDto.imageUrl = imageDto.imageUrl;

            // Close the dialog with the full herbDto including the image URL
            this.dialogRef.close(herbDto);
          },
          (error) => {
            console.error('Error uploading image:', error);
          }
        );
      } else {
        // If no image selected, just close with the form data
        this.dialogRef.close(herbDto);
      }
    }
  }



  onCancel(): void {
    this.dialogRef.close();
  }
}
