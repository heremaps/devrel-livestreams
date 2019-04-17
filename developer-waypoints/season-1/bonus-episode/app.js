class HereDev {

    constructor(tokens) {
        this.platform = new H.service.Platform(tokens);
        this.geocoderService = this.platform.getGeocodingService();
        this.search = new H.places.Search(this.platform.getPlacesService());
        this.routerService = this.platform.getRoutingService();
        this.markers = [];
        this.polylines = [];
    }

    createMap(domElement, center, zoom) {
        this.map = new H.Map(
            domElement,
            this.platform.createDefaultLayers().normal.map,
            {
                zoom: zoom,
                center: center
            }
        );
        const mapEvents = new H.mapevents.MapEvents(this.map);
        const behavior = new H.mapevents.Behavior(mapEvents);
    }

    dropMarker(position, event) {
        this.markers.push(new H.map.Marker(position));
        if(event) {
            this.markers[this.markers.length - 1].addEventListener("tap", event);
        }
        this.map.addObject(this.markers[this.markers.length - 1]);
    }

    drawPolygon(positions) {
        const lineString = new H.geo.LineString();
        positions.forEach(points => lineString.pushPoint(points));
        const polygon = new H.map.Polygon(
            lineString,
            {
                style: {
                    fillColor: "rgba(255, 0, 0, 0.5)"
                }
            }
        );
        this.map.addObject(polygon);
    }

    clearPolylines() {
        this.map.removeObjects(this.polylines);
        this.polylines = [];
    }

    drawPolyline(positions) {
        const lineString = new H.geo.LineString();
        positions.forEach(points => lineString.pushPoint(points));
        const polyline = new H.map.Polyline(
            lineString,
            {
                style: {
                    lineWidth: 5,
                    strokeColor: "rgb(0, 255, 0)"
                }
            }
        );
        this.polylines.push(polyline);
        this.map.addObject(this.polylines[this.polylines.length - 1]);
    }

    geocoder(query) {
        return new Promise((resolve, reject) => {
            this.geocoderService.geocode(
                {
                    "searchtext": query
                },
                success => {
                    resolve(success.Response.View[0].Result[0].Location.DisplayPosition);
                },
                error => {
                    reject(error);
                }
            );
        }).then(success => {
            return {
                lat: success.Latitude,
                lng: success.Longitude
            }
        });
    }

    places(query, coords, radius) {
        return new Promise((resolve, reject) => {
            this.search.request(
                {
                    q: query,
                    in: coords.lat + "," + coords.lng + ";r=" + radius
                },
                {},
                success => {
                    resolve(success.results.items);
                },
                error => {
                    reject(error);
                }
            )
        });
    }

    calculateRoute(start, finish) {
        return new Promise((resolve, reject) => {
            const params = {
                mode: "fastest;car;traffic:enabled",
                waypoint0: start.lat + "," + start.lng,
                waypoint1: finish.lat + "," + finish.lng,
                representation: "display"
            };
            this.routerService.calculateRoute(params, success => {
                resolve(success.response.route[0].shape);
            }, error => {
                reject(error);
            });
        }).then(success =>
            success.map(point => {
                const [lat, lng] = point.split(",");
                return { lat: lat, lng: lng };
            })
        );
    };

    calculateIsoline(start, range) {
        return new Promise((resolve, reject) => {
            const params = {
                start: start.lat + "," + start.lng,
                mode: "fastest;car;traffic:enabled",
                departure: "now",
                rangeType: "time",
                range: range
            };
            this.routerService.calculateIsoline(params, success => {
                resolve(success.response.isoline[0].component[0].shape);
            }, error => {
                reject(error);
            });
        }).then(success =>
            success.map(point => {
                const [lat, lng] = point.split(",");
                return { lat: lat, lng: lng };
            })
        );
    };

}