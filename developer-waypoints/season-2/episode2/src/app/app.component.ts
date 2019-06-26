import { Component, OnInit, ViewChild } from '@angular/core';
import { HereMapComponent } from "./here-map/here-map.component";

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

    @ViewChild("map", { static: false })
    private mapElement: HereMapComponent;

    public ngOnInit() { }

    public ngAfterViewInit() {
        this.mapElement.dropMarker({ lng: -122, lat: 47.6 });
        this.mapElement.dropMarker({ lat: 47, lng: -122.2 });
        this.mapElement.drawLine({ lat: 47.6, lng: -122 }, { lat: 47, lng: -122.2 });
        this.mapElement.geocodeAddress("Rome Italy");
    }

    public mapClick(event: any) {
        const position = this.mapElement.getPositionAt(event.clientX, event.clientY);
        this.mapElement.highlightRegion(position);
    }

}