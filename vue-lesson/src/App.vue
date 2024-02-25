<template>
  <div class="app">
    <MyEditor v-model="state"></MyEditor>
  </div>
</template>

<script>
import { ref, provide } from 'vue';
import data from './data.json'
import MyEditor from './packages/MyEditor'
import { registerConfig as config } from './utils/MyEditorConfig'

export default {
  components: {
    MyEditor
  },
  setup() {
    const state = ref(data)

    // 将组件的配置直接传入
    provide('config', config)

    return {
      state
    }
  }
}
</script>

<style lang="scss">
  .app {
    position: fixed;
    top: 20px;
    left: 20px;
    right: 20px;
    bottom: 20px;
  }
</style>
