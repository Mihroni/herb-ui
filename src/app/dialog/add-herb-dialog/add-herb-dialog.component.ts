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
import {HerbDto} from "../../dto/herb-dto";

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

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<AddHerbDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.herbForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      seasons: [[], Validators.required],
      benefits: ['', Validators.required],
      locations: this.fb.array([])
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

  onSave(): void {
    if (this.herbForm.valid) {
      const herbDto: HerbDto = this.herbForm.value;
      this.dialogRef.close(herbDto);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
