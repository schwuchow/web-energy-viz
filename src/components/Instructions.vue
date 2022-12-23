<template>
<div class="instructions col-2">
  <h2>Instructions</h2>
  <div class="instructions__text">Say "Hi, my home" to evoke speech</div>
</div>
</template>

<style lang="scss" scoped>
.instructions {
  grid-row: span 3;
  padding: 0 20px 20px;

  .instructions__text {
    background-color: var(--color-light);
    color: var(--color-primary);
    border: 2px solid var(--color-primary);
    border-radius: 10px;
    padding: 10px;
    height: 75%;
  }
}
</style>