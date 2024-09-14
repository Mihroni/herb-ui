import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {Group} from "../../model/group";
import {lastValueFrom} from "rxjs";
import {GroupService} from "../../service/group.service";
import {MatDialog} from "@angular/material/dialog";
import {AddGroupDialogComponent} from "../../dialog/add-group-dialog/add-group-dialog.component";
import {HerbService} from "../../service/herb.service";
import {Herb} from "../../model/herb";
import {Location} from "../../model/location";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import VectorLayer from "ol/layer/Vector";
import {Feature, View} from "ol";
import Map from "ol/Map";
import {Vector as VectorSource} from "ol/source";
import Point from "ol/geom/Point";
import {Icon, Style} from "ol/style";
import proj4 from 'proj4';

@Component({
  selector: 'app-group',
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.css']
})
export class GroupComponent implements OnInit {
  groups: Group[] = []
  userId!: string
  username!: string
  location!: Location
  herb!: Herb
  itemsPerPage = 6;
  p: number = 1;
  map!: Map;
  vectorSource = new VectorSource();
  googleMapsUrl: string = '';
  gpsCoordinates: { lat: number; lon: number } = { lat: 0, lon: 0 };
  imageUrl: string = '';

  constructor(private route: ActivatedRoute, private readonly groupService: GroupService,private dialog: MatDialog, private readonly router: Router, private readonly herbService: HerbService) {
  }

  async ngOnInit(): Promise<void> {
    await this.getById(this.route.snapshot.paramMap.get('locationId'));
    this.userId = localStorage.getItem('user_id') || '';
    this.username = localStorage.getItem('username') || '';
    await this.getHerb(this.route.snapshot.paramMap.get('locationId'));
    await this.getLocation(this.route.snapshot.paramMap.get('locationId'));
    await this.initializeMap();
    await this.convertToGPSCoordinates();
    await this.generateGoogleMapsUrl();
    const parsedUrl = this.parseImageUrl(this.herb.imageUrl);
    this.imageUrl = 'http://localhost:8080' + parsedUrl;
  }

  async getById(id: string | null): Promise<void> {
    if (id) {
      const data = this.groupService.findAllByLocationId(id);
      this.groups = await lastValueFrom(data);
    }
  }

  async generateGoogleMapsUrl(): Promise<void> {
    this.googleMapsUrl = `https://www.google.com/maps?q=${this.gpsCoordinates.lat},${this.gpsCoordinates.lon}`;
  }

  async getHerb(id: string | null): Promise<void> {
    if (id) {
      const data = this.herbService.findByLocationId(id);
      this.herb = await lastValueFrom(data);
    }
  }

  async getLocation(id: string | null): Promise<void> {
  if (id) {
    this.herb.locations.find(location => {
      if (location.id === id){

      this.location = location;
      }
    })
  }
  }

  createGroup(): void {
    const locationId = this.route.snapshot.paramMap.get('locationId');

    const dialogRef = this.dialog.open(AddGroupDialogComponent, {
      width: '600px',
      height: '400px',
      data: { locationId }
    });

    dialogRef.afterClosed().subscribe(result => {
        location.reload();
    });
  }
  canJoin(group: Group) {
    return !group.participants.includes(this.username);
  }

  activity(id: string): void {
    this.groupService.activity(id).subscribe(() => {location.reload()})
  }

  viewChat(id: string) {
    this.router.navigate(['/chat', id]).then();
  }

 async  initializeMap(): Promise<void> {
    this.map = new Map({
      target: 'map',
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
        new VectorLayer({
          source: this.vectorSource,
          zIndex: 2,
        }),
      ],
      view: new View({
        center: [parseFloat(this.location.x), parseFloat(this.location.y)],
        zoom: 14,
      }),
    });

    const point = new Feature({
      geometry: new Point([parseFloat(this.location.x), parseFloat(this.location.y)]),
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
  }


  async convertToGPSCoordinates(): Promise<void> {
    const [x, y] = [parseFloat(this.location.x), parseFloat(this.location.y)];

    // Conversion from EPSG:3857 (Web Mercator) to EPSG:4326 (WGS 84 / GPS)
    const [lon, lat] = proj4('EPSG:3857', 'EPSG:4326', [x, y]);

    this.gpsCoordinates = { lat, lon };
  }

  viewLocation(): void {
    window.open(this.googleMapsUrl, '_blank');
  }

  sortGroupsByGatheringTime(): void {
    const now = new Date();
    this.groups.sort((a, b) => {
      const timeA = new Date(a.gatheringTime).getTime();
      const timeB = new Date(b.gatheringTime).getTime();

      if (timeA < now.getTime() && timeB < now.getTime()) {
        // Both dates are in the past
        return timeA - timeB;
      } else if (timeA >= now.getTime() && timeB >= now.getTime()) {
        // Both dates are in the future
        return timeA - timeB;
      } else if (timeA >= now.getTime()) {
        // Only timeA is in the future
        return -1;
      } else {
        // Only timeB is in the future
        return 1;
      }
    });
  }

  private parseImageUrl(url: string): string {
    try {
      // Parse the JSON string to get the object
      const parsedObject = JSON.parse(url);
      // Extract the imageUrl value
      return parsedObject.imageUrl;
    } catch (error) {
      console.error('Error parsing image URL:', error);
      // If parsing fails, return the original URL
      return url;
    }
  }
}
