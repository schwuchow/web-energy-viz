import { defineStore } from 'pinia';
import { ref, Ref } from 'vue';
import {  Device, Visualization, CustomDate } from './types/interfaces';

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
    bathroomWashingMashine1: "Washing Machine 1",
    bathroomWashingMashine2: "Washing Machine 2",
    bathroomDryer1: "Dryer 1",
    bathroomDryer2: "Dryer 2",
    kitchenDishWasher1: "Dish Washer 1",
    kitchenDishWasher2: "Dish Washer 2",
    kitchenFridge1: "Fridge 1",
    kitchenFridge2: "Fridge 2",
    kitchenCoffeeMachine1: "Coffee Machine 1",
    kitchenCoffeeMachine2: "Coffee Machine 2",
  }

  const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const multimodal: Ref<boolean> = ref(false);

  const svgContent: Ref<HTMLElement & SVGElement> | Ref<null> = ref(null);

  const devices: Ref<Map<string, Device>> = ref(new Map());
  const deviceValue: Ref<string[]> = ref([]);
  const visualization: Ref<Visualization> | Ref<null> = ref(null);

  const date: Ref<CustomDate> = ref({ day: 0, month: 0, year: 0});

  return { deviceIds, deviceValue, deviceNames, devices, visualization, svgContent, multimodal, monthNames, date };
});