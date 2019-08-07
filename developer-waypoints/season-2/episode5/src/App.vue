<template>
    <div id="app">
        <HereMap
            ref="map"
            apiKey="HERE_API_KEY">
        </HereMap>
    </div>
</template>

<script>
import HereMap from './components/HereMap.vue'

export default {
    name: 'app',
    components: {
        HereMap
    },
    mounted() {
        let map = this.$refs.map;
        map.dropMarker({ lat: 37.11, lng: -121.11 });
        map.drawCircle({ lat: 37.11, lng: -121.11 }, 10000);
        map.drawLine({ lat: 37.11, lng: -121.11 }, { lat: 37, lng: -121 });
    }
}
</script>

<style>
    body {
        margin: 0;
    }
</style>
