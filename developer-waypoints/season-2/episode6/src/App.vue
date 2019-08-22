<template>
    <div id="app">
        <LeafletMap
            ref="map"
            apiKey=""
            lat="37.7297"
            lng="-121.4252"
            app_id=""
            app_code="">
        </LeafletMap>
    </div>
</template>

<script>
import HereMap from './components/HereMap.vue'
import LeafletMap from './components/LeafletMap.vue'

export default {
    name: 'app',
    components: {
        HereMap,
        LeafletMap
    },
    async mounted() {
        let map = this.$refs.map;
        let waypoints = [
            { lat: 37.74682893940135, lng: -121.4198684692383 },
            { lat: 37.73488314788311, lng: -121.44561767578126 },
            { lat: 37.72076290898376, lng: -121.41712188720705 },
            { lat: 37.74251196215947, lng: -121.435 },
            { lat: 37.731793096495316, lng: -121.41770044283479 },
            { lat: 37.74, lng: -121.46 },
            { lat: 37.72, lng: -121.455 }
        ];
        waypoints.forEach(waypoint => {
            map.dropMarker(waypoint);
        });
        let sequence = await map.calculateRouteSequence(waypoints);
        map.drawRoute(waypoints);
    }
}
</script>

<style>
    body {
        margin: 0;
    }
</style>
