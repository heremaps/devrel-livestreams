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
    private geocodingService: any;

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
        this.geocodingService = this.platform.getGeocodingService();
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

    public geocodeAddress(query: string) {
        this.geocodingService.geocode(
            {
                "searchtext": query
            },
            success => {
                console.log(success);
            },
            error => {
                console.error(error);
            }
        )
    }

    public getPositionAt(x: number, y: number) {
        return this.map.screenToGeo(x, y);
    }

    public highlightRegion(position: any) {
        this.geocodingService.reverseGeocode(
            {
                "mode": "retrieveAddresses",
                "maxresults": 1,
                "prox": position.lat + "," + position.lng,
                "additionaldata": "IncludeShapeLevel,state"
            },
            success => {
                //console.log(success);
                const locations = success.Response.View[0].Result;
                const shape = locations[0].Location.Shape.Value;
                const geometry = H.util.wkt.toGeometry(shape);
                if(geometry instanceof H.geo.MultiGeometry) {
                    const geometryArray = geometry.getGeometries();
                    for(let i = 0; i < geometryArray.length; i++) {
                        this.map.addObject(new H.map.Polygon(
                            geometryArray[i].getExterior()
                        ));
                    }
                } else {
                    this.map.addObject(new H.map.Polygon(
                        geometry.getExterior()
                    ));
                }
            },
            error => {
                console.error(error);
            }
        );
    }

}