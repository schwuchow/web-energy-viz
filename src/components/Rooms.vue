<template>
<div class="rooms col-2">
  <h2>Rooms</h2>
  <Room :img="houseImg" title="All Rooms" :amount="10"/>
  <Room :img="kitchenImg" title="Kitchen" :amount="6"/>
  <Room :img="bathroomImg" title="Bathroom" :amount="4"/>
</div>
</template>

<script lang="ts">
import Room from './rooms/Room.vue';
import houseImg from '../assets/house.svg';
import bathroomImg from '../assets/bathroom.svg';
import kitchenImg from '../assets/kitchen.svg';

export default {
  components: {
    Room,
  },
  setup() {
    return { Room, houseImg, bathroomImg, kitchenImg};
  }
}
</script>

<style lang="scss" scoped>
.rooms {
  grid-row: span 5;
}
</style>