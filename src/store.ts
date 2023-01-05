import { defineStore } from 'pinia';
import { ref, Ref } from 'vue';
import {  Device, Visualization, CustomDate, Room, FocusSelectedRooms } from './types/interfaces';

export const useDevicesStore = defineStore('devices', () => {
  const deviceIds = {
    bathroomWashingMashine1: "bathroom-washing-machine-1",
    bathroomWashingMashine2: "bathroom-washing-machine-2",
    bathroomDryer1: "bathroom-dryer-1",
    bathroomDryer2: "bathroom-dryer-2",
    kitchenDishWasher1: "kitchen-dish-washer-1",
    kitchenDishWasher2: "kitchen-dish-washer-2",
    kitchenFridge1: "kitchen-fridge-1",
    kitchenFridge2: "kitchen-fridge-2",
    kitchenCoffeeMachine1: "kitchen-coffee-machine-1",
    kitchenCoffeeMachine2: "kitchen-coffee-machine-2",
  };

  const deviceNames: any = {
    bathroomWashingMashine1: "Upper Washing Machine",
    bathroomWashingMashine2: "Bottom Washing Machine",
    bathroomDryer1: "Big Dryer",
    bathroomDryer2: "Small Dryer",
    kitchenDishWasher1: "Bottom Dish Washer",
    kitchenDishWasher2: "Left Dish Washer",
    kitchenFridge1: "Lower Fridge",
    kitchenFridge2: "Upper Fridge",
    kitchenCoffeeMachine1: "Left Coffee Machine",
    kitchenCoffeeMachine2: "Right Coffee Machine",
  }

  const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const multimodal: Ref<boolean> = ref(true);
  const calibration: Ref<boolean> = ref(false);

  const svgContent: Ref<HTMLElement & SVGElement> | Ref<null> = ref(null);

  const devices: Ref<Map<string, Device>> = ref(new Map());
  const rooms: Ref<Map<string, Room>> = ref(new Map());
  const deviceValue: Ref<string[]> = ref([]);
  const visualization: Ref<Visualization> | Ref<null> = ref(null);

  const date: Ref<CustomDate> = ref({ day: 0, month: 0, year: 0});
  const focusedDevices: Ref<string[]> = ref([]);
  const isSelectedThroughFocus: Ref<FocusSelectedRooms> = ref({ allRooms: false, kitchen: false, bathroom: false });

  const speechBtnOnFocus: Ref<boolean> = ref(false);

  return { deviceIds,
           deviceValue,
           deviceNames,
           devices,
           visualization,
           svgContent,
           multimodal,
           monthNames,
           date,
           calibration,
           focusedDevices,
           rooms,
           isSelectedThroughFocus,
           speechBtnOnFocus,
         };
});