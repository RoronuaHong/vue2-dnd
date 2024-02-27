import { ref, inject, computed, onMounted, defineComponent } from 'vue'

export default defineComponent({
  props: {
    block: {
      type: Object,
      required: true
    }
  },
  emits: ['update:block'],
  setup(props, ctx) {
    const style = ref({
      top: `${props.block.top}px`,
      left: `${props.block.left}px`,
      zIndex: `${props.block.zIndex}`
    })

    const blockStyles = computed({
      get: () => style.value,
      set: (newVal) => {
        style.value = {
          ...style.value, // 保留原有的属性值
          ...newVal // 更新新的属性值
        }
        ctx.emit('update:block', style.value)
      }
    })

    const config = inject('config')
    const blockRef = ref(null)

    onMounted(() => {
      let { offsetWidth, offsetHeight } = blockRef.value

      if(props.block.alignCenter) {
        const newLeft = props.block.left - offsetWidth / 2
        const newTop = props.block.top - offsetHeight / 2
        const newAlignCenter = false

        blockStyles.value = {
          ...blockStyles.value,
          left: `${newLeft}px`,
          top: `${newTop}px`,
          alignCenter: newAlignCenter
        }
      }
    })

    return () => {
      const component = config.componentMap[props.block.key]
      const RenderComponent = component.render()

      return (
        <div class="editor-block" style={blockStyles.value} ref={blockRef}>
          {RenderComponent}
        </div>
      )
    }
  }
})
