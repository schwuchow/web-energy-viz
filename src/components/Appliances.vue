<template>
<div class="appliances col-2">
  <h2>Appliances</h2>
  <div class="appliances__all-devices">
    <div>
      <img :src="houseImg" id="appliances__house-icon" class="icon" />
      <p class="appliances__house-text">All Devices</p>
    </div>
    <div class="appliances__house-toggle">
      <p>Un<wbr>selected</p>
      <div class="appliances__house-toggle-nr">5</div>
    </div>
  </div>
  <div class="appliances__all-devices selected">
    <div>
      <img :src="houseImg" id="appliances__house-icon" class="icon" />
      <p class="appliances__house-text">All Devices</p>
    </div>
    <div class="appliances__house-toggle">
      <p>Un<wbr>selected</p>
      <div class="appliances__house-toggle-nr">5</div>
    </div>
  </div>
</div>
</template>

<script lang="ts">
import houseImg from '../assets/house.svg';

export default {
  setup() {
    return { houseImg };
  }
}
</script>

<style lang="scss" scoped>
.appliances {
  grid-row: span 5;

  .appliances__all-devices {
    background-color: var(--color-secondary);
    border-radius: 10px;
    height: 130px;
    display: flex;
    padding: 20px;
    width: calc(100% - 60px);
    margin: auto;

    .appliances__house-text {
      color: var(--color-light);
      text-transform: uppercase;
      font-weight: bold;
    }

    .appliances__house-toggle {
      height: 100%;
      width: 50%;
      border-radius: 10px;
      background: rgba(250,250,250,0.3);
      display: flex;
      flex-direction: column;
      margin-left: 10px;

      p {
        text-transform: uppercase;
        margin-bottom: 5px;
        font-size: 15px;
      }

      .appliances__house-toggle-nr {
        width: calc(100% - 20px);
        height: 50px;
        background-color: var(--color-light);
        font-weight: bold;
        color: #A5A9FF;
        margin: 0 auto;
        margin-bottom: 10px;
        line-height: 50px;
        border-radius: 10px;
      }
    }
  }

  .selected {
    &.appliances__all-devices {
      background-color: #F7B634;

      .appliances__house-text {
        color: var(--color-secondary);
      }

      .appliances__house-icon {
        fill: var(--color-secondary);
      }

      .appliances__house-toggle {
        flex-direction: column-reverse;
        .appliances__house-toggle-nr {
          margin: 0 auto;
          margin-bottom: 0;
          margin-top: 10px;
        }
      }
    }
  }
}
</style>