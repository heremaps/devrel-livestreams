<template>
    <div>
        <div ref="map" id="map"></div>
    </div>
</template>

<script>
    export default {
        name: 'HereMap',
        props: {
            apiKey: String
        },
        data() {
            return {
                platform: {},
                map: {}
            }
        },
        created() {
            this.platform = new H.service.Platform({
                apikey: this.apiKey
            });
        },
        mounted() {
            this.map = new H.Map(
                this.$refs.map,
                this.platform.createDefaultLayers().vector.normal.map,
                {
                    center: { lat: 37, lng: -121 },
                    zoom: 10
                }
            );
            let mapEvent = new H.mapevents.MapEvents(this.map);
            let behavior = new H.mapevents.Behavior(mapEvent);
            this.dropMarker({ lat: 37, lng: -121 });
        },
        methods: {
            dropMarker(position) {
                let marker = new H.map.Marker(position);
                this.map.addObject(marker);
            },
            drawCircle(position, radius) {
                let circle = new H.map.Circle(position, radius);
                this.map.addObject(circle);
            },
            drawLine(start, finish) {
                let lineString = new H.geo.LineString();
                lineString.pushPoint(start);
                lineString.pushPoint(finish);
                let polyline = new H.map.Polyline(
                    lineString,
                    {
                        style: {
                            lineWidth: 7
                        }
                    }
                );
                this.map.addObject(polyline);
            }
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    #map {
        width: 100vw; 
        height: 100vh; 
        background-color: pink;
    }
</style>
