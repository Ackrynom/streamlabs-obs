<template>
<modal-layout
  :title="options.rename ? 'Rename Scene' : 'Name Scene'"
  :done-handler="submit">
  <form
    slot="content"
    @submit.prevent="submit">
    <p
      v-if="!error"
      class="NameScene-label">
      Please enter the name of the scene
    </p>
    <p
      v-if="error"
      class="NameScene-label NameScene-label__error">
      {{ error }}
    </p>
    <input
      autofocus
      type="text"
      v-model="name"/>
  </form>
</modal-layout>
</template>

<script lang="ts" src="./NameScene.vue.ts"></script>

<style lang="less" scoped>
.NameScene-label {
  margin-bottom: 10px;
}

.NameScene-label__error {
  color: red;
}
</style>
