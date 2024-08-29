import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import Map from 'ol/Map';
import View from 'ol/View';
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer';
import { OSM, Vector as VectorSource } from 'ol/source';
import { Feature } from 'ol';
import Point from 'ol/geom/Point';
import { Icon, Style } from 'ol/style';
import { lastValueFrom } from 'rxjs';
import {Herb} from "../../model/herb";
import {HerbService} from "../../service/herb.service";

@Component({
  selector: 'app-view-herb',
  templateUrl: './view-herb.component.html',
  styleUrls: ['./view-herb.component.css']
})
export class ViewHerbComponent implements OnInit {
  herb!: Herb;
  map!: Map;
  vectorSource = new VectorSource();

  constructor(private route: ActivatedRoute, private readonly herbService: HerbService, private readonly router: Router) {}

  async ngOnInit(): Promise<void> {
    await this.getById(this.route.snapshot.paramMap.get('herbId'));
    this.initializeMap();
  }

  async getById(id: string | null): Promise<void> {
    if (id){
    const data = this.herbService.findById(id);
    this.herb = await lastValueFrom(data);
    }
  }

  initializeMap(): void {
    this.map = new Map({
      target: 'map',
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
        new VectorLayer({
          source: this.vectorSource,
          zIndex: 2, // Ensure this layer is on top
        }),
      ],
      view: new View({
        center: [2596360.338676, 5256217.797053], // Initial center
        zoom: 14, // Adjust as needed
      }),
    });

    // Add existing locations to the map without transforming the coordinates
    this.herb.locations.forEach((location) => {
      const coordinate = [parseFloat(location.x), parseFloat(location.y)];

      const point = new Feature({
        geometry: new Point(coordinate),
        id: location.id, // Store the location.id in the feature
      });

      point.setStyle(
        new Style({
          image: new Icon({
            src: 'https://cdn-icons-png.flaticon.com/512/854/854866.png',
            scale: 0.08,
            anchor: [0.5, 1],
          }),
        })
      );

      this.vectorSource.addFeature(point);
    });

    // Fit the map view to include all markers
    const extent = this.vectorSource.getExtent();
    this.map.getView().fit(extent, { padding: [50, 50, 50, 50], maxZoom: 16 });

    // Add click event listener to the map
    this.map.on('click', (event) => {
      this.map.forEachFeatureAtPixel(event.pixel, (feature) => {
        const locationId = feature.get('id');
        if (locationId) {
          this.viewGroup(locationId)
        }
      });
    });
  }

  viewGroup(id: String) {
    this.router.navigate(['/group', id]).then();
  }
}
