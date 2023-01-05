<template>
<div class="room" :id="id" :class="{selected: isSelected}" @click="toggleSelected">
  <div>
    <img :src="img" id="room__icon" class="icon" />
    <p class="room__text">{{ title }}</p>
  </div>
  <div class="room__toggle">
    <template v-if="isSelected">
      <p>Selected</p>
    </template>
    <template v-else>
      <p>Un<wbr>selected</p>
    </template>
    <div class="room__toggle-nr">{{ amount }}</div>
  </div>
</div>
</template>

<script lang="ts">
import { ref, onMounted, VNodeRef, watch } from 'vue';
import { useDevicesStore } from '../../store';
import { storeToRefs } from 'pinia';
import { FocusSelectedRooms } from '../../types/interfaces';

export default {
  props: {
    img: String,
    title: String,
    amount: Number,
  },
  setup(props) {
    const allDevices: VNodeRef | null = ref(null);
    const isSelected = ref(false);
    const store = useDevicesStore();
		const { deviceValue, isSelectedThroughFocus } = storeToRefs(store);
    const { deviceIds } = store;
    const id = props.title?.replace(" ", "-").toLowerCase();

    onMounted(() => {
    });

    const toggleSelected = (ev: Event) => {
      isSelected.value = !isSelected.value;
    };

    watch(isSelected, (value) => {
      setSelectedDevices(value);
    });

    watch(isSelectedThroughFocus.value, (value) => {
      setSelectedDevicesThroughFocus(value);
    });

    const setSelectedDevices = (isSelected: boolean) => {
      if (isSelected) {
        if (props.title === "All Rooms") {
          deviceValue.value = Object.values(deviceIds);
        } else if (props.title === "Kitchen") {
          deviceValue.value = Object.values(deviceIds).filter(id => id.includes('kitchen'));
        } else {
          deviceValue.value = Object.values(deviceIds).filter(id => id.includes('bathroom'));
        }
      } else {
        deviceValue.value = [];
      }
    };

    const setSelectedDevicesThroughFocus = (selectedObj: FocusSelectedRooms) => {
      for (var k in selectedObj) {
        if (k == "allRooms" && props.title === "All Rooms") isSelected.value = selectedObj[k as keyof FocusSelectedRooms];
        else if (k === "kitchen" && props.title === "Kitchen") isSelected.value = selectedObj[k as keyof FocusSelectedRooms];
        else if (k === "bathroom" && props.title === "Bathroom") isSelected.value = selectedObj[k as keyof FocusSelectedRooms];
      }
    }

    return { allDevices, isSelected, toggleSelected, id, setSelectedDevicesThroughFocus };
  }
}
</script>


<style lang="scss" scoped>
.room {
  background-color: var(--color-secondary);
  border-radius: 10px;
  height: 100px;
  display: flex;
  padding: 10px;
  width: calc(100% - 60px);
  margin: auto;
  cursor: pointer;
  user-select: none;

  .room__text {
    color: var(--color-light);
    text-transform: uppercase;
    font-weight: bold;
    margin-top: 0;
  }

  #room__icon {
      width: 70%;
      height: 70%;
    }

  .room__toggle {
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

    .room__toggle-nr {
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

  &:hover {
    background-color: #8c8fd8;
  }
}

.room + .room {
  margin-top: 10px;
}

.selected {
  &.room {
    background-color: #F7B634;

    .room__text {
      color: var(--color-light);
    }

    #room__icon {
      fill: var(--color-secondary);
    }

    .room__toggle {
      flex-direction: column-reverse;
      justify-content: flex-end;

      .room__toggle-nr {
        margin: 0 auto;
        margin-bottom: 0;
        margin-top: 10px;
        color: #F7B634;
      }
    }
  }

  &:hover {
    background-color: #daa12f;
  }
}
</style>