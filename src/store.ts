import { defineStore } from 'pinia';
import { ref, Ref } from 'vue';

interface Visualization {
  timePeriod: number,
  deviceId: string,
}

export const useDevicesStore = defineStore('devices', () => {
  const deviceIds = {
    bathroomWashingMashine: "bathroom-washing-machine",
    bathroomDryer: "bathroom-dryer",
    kitchenDishWasher: "kitchen-dish-washer",
    kitchenFreezer: "kitchen-freezer",
    kitchenFridge: "kitchen-fridge",
  };

  const devices = ref(new Map());
  const visualization: Ref<Visualization> | Ref<null> = ref(null);

  return { deviceIds, devices };
});