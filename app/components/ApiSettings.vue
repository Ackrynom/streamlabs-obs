<template>
  <div>
    <div class="section">
      <button class="button button--action" @click="restoreDefaults">
        Restore Defaults
      </button>
    </div>

    <GenericFormGroups
        v-model="settingsFormData"
        @input="save" />
  </div>
</template>

<script lang="ts" src="./ApiSettings.vue.ts"></script>

