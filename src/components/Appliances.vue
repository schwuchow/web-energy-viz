<template>
<div class="appliances col-2">
  <h2>Appliances</h2>
  <div class="appliances__all-devices" :class="{selected: isSelected}" @click="toggleSelected">
    <div>
      <img :src="houseImg" id="appliances__house-icon" class="icon" />
      <p class="appliances__house-text">All Devices</p>
    </div>
    <div class="appliances__house-toggle">
      <template v-if="isSelected">
        <p>Selected</p>
      </template>
      <template v-else>
        <p>Un<wbr>selected</p>
      </template>
      <div class="appliances__house-toggle-nr">10</div>
    </div>
  </div>
</div>
</template>

<script lang="ts">
import houseImg from '../assets/house.svg';
import { ref, onMounted, VNodeRef } from 'vue';

export default {
  setup() {
    const allDevices: VNodeRef | null = ref(null);
    const isSelected = ref(false);

    onMounted(() => {
    });

    const toggleSelected = (ev: Event) => {
      isSelected.value = !isSelected.value;
    };

    return { houseImg, allDevices, isSelected, toggleSelected };
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
    cursor: pointer;
    user-select: none;

    .appliances__house-text {
      color: var(--color-light);
      text-transform: uppercase;
      font-weight: bold;
    }

    .appliances__house-toggle {
      height: 100%;
      width: 50%;
      border-radius: 10px;
      background: rgba(0,0,0,0.1);
      display: flex;
      flex-direction: column;
      margin-left: 10px;

      p {
        text-transform: uppercase;
        margin-bottom: 5px;
        font-size: 14px;
        color: var(--color-light);
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
        font-size: 35px;
      }
    }
  }

  .selected {
    &.appliances__all-devices {
      background-color: #F7B634;

      .appliances__house-text {
        color: var(--color-light);
      }

      .appliances__house-icon {
        fill: var(--color-secondary);
      }

      .appliances__house-toggle {
        flex-direction: column-reverse;
        justify-content: flex-end;

        .appliances__house-toggle-nr {
          margin: 0 auto;
          margin-bottom: 0;
          margin-top: 10px;
          color: #F7B634;
        }
      }
    }
  }
}
</style>