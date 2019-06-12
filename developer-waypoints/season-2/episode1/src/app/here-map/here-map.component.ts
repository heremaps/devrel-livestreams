import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';

declare var H: any;

@Component({
    selector: 'here-map',
    templateUrl: './here-map.component.html',
    styleUrls: ['./here-map.component.css']
})
export class HereMapComponent implements OnInit {

    private platform: any;
    private map: any;

    @ViewChild("map", { static: false })
    private mapElement: ElementRef;

    @Input("appid")
    private appId: string;

    @Input("appcode")
    private appCode: string;

    @Input("zoom")
    private zoom: number;

    @Input("lat")
    private lat: number;

    @Input("lng")
    private lng: number;

    public constructor() { }

    public ngOnInit() {
        this.platform = new H.service.Platform({
            "app_id": this.appId,
            "app_code": this.appCode
        });
    }

    public ngAfterViewInit() {
        this.map = new H.Map(
            this.mapElement.nativeElement,
            this.platform.createDefaultLayers().normal.map,
            {
                zoom: this.zoom,
                center: { lat: this.lat, lng: this.lng }
            }
        );
        let mapEvents = new H.mapevents.MapEvents(this.map);
        let behavior = new H.mapevents.Behavior(mapEvents);
    }

    public dropMarker(position: any) {
        let marker = new H.map.Marker(position);
        this.map.addObject(marker);
    }

    public drawLine(pos1: any, pos2: any) {
        let lineString = new H.geo.LineString();
        lineString.pushPoint(pos1);
        lineString.pushPoint(pos2);
        let polyline = new H.map.Polyline(
            lineString,
            {
                style: {
                    lineWidth: 5
                }
            }
        );
        this.map.addObject(polyline);
    }

}