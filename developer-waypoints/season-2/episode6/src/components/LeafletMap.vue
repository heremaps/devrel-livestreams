<template>
    <div>
        <div ref="map" id="map"></div>
    </div>
</template>

<script>
    import axios from "axios";
    export default {
        name: 'LeafletMap',
        props: {
            apiKey: String,
            lat: String,
            lng: String,
            app_id: String,
            app_code: String
        },
        data() {
            return {
                platform: {},
                map: {}
            }
        },
        created() {
        },
        mounted() {
            this.map = new L.Map(
                this.$refs.map,
                {
                    center: [this.lat, this.lng],
                    zoom: 12,
                    layers: [
                        L.tileLayer(
                            "https://1.base.maps.api.here.com/maptile/2.1/maptile/newest/normal.day/{z}/{x}/{y}/256/png8?app_id={app_id}&app_code={app_code}", 
                            {
                                app_id: this.app_id,
                                app_code: this.app_code
                            }
                        )
                    ]
                }
            )
        },
        methods: {
            calculateRouteSequence(waypoints) {
                let destinations = {};
                for(let i = 0; i < waypoints.length; i++) {
                    destinations["destination" + (i + 1)] = `${waypoints[i].lat},${waypoints[i].lng}`
                }
                return axios(
                    {
                        url: "https://wse.api.here.com/2/findsequence.json",
                        method: "GET",
                        params: {
                            mode: "fastest;car",
                            start: `${this.lat},${this.lng}`,
                            end: `${this.lat},${this.lng}`,
                            app_id: this.app_id,
                            app_code: this.app_code,
                            ...destinations
                        }
                    }
                ).then(result => {
                    return result.data.results[0].waypoints;
                })
            },
            drawRoute(sequence) {
                let waypoints = {};
                for(let i = 0; i < sequence.length; i++) {
                    waypoints["waypoint" + i] = `${sequence[i].lat},${sequence[i].lng}`;
                }
                axios(
                    {
                        url: "https://route.api.here.com/routing/7.2/calculateroute.json",
                        method: "GET",
                        params: {
                            app_id: this.app_id,
                            app_code: this.app_code,
                            mode: "fastest;car",
                            representation: "display",
                            ...waypoints
                        }
                    }
                ).then(result => {
                    let shape = result.data.response.route[0].shape;
                    let positions = shape.map(point => point.split(","));
                    L.polyline(positions).addTo(this.map).snakeIn();
                });
            },
            dropMarker(position) {
                L.marker(position).addTo(this.map);
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
