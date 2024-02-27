import { ref, inject, computed, onMounted, defineComponent } from 'vue'
// import deepcopy from 'deepcopy'

export default defineComponent({
  props: {
    block: {
      type: Object,
      required: true
    }
  },
  emits: ['update:block'], // 声明自定义事件
  setup(props, ctx) {
    const style = {
      top: `${props.block.top}px`,
      left: `${props.block.left}px`,
      zIndex: `${props.block.zIndex}`
    }

    // const blockStyles = computed(() => style)

    const blockStyles = computed(() => ({
      get:() => style,
      set: (newVal) => {
        ctx.emit('update:block', newVal)
      }
    }))

    const config = inject('config')
    const blockRef = ref(null)

    onMounted(() => {
      let { offsetWidth, offsetHeight } = blockRef.value

      console.log(offsetWidth, offsetHeight)

      // 说明是拖拽松手的时候才渲染的, 其他的默认渲染到页面上的内容不需要居中
      if(props.block.alignCenter) {
        const newLeft = props.block.left - offsetWidth / 2
        const newTop = props.block.top - offsetHeight / 2  // 原则上重新派发事件
        const newAlignCenter = false

        blockStyles.value = {
          ...props.block.block,
          left: newLeft,
          top: newTop,
          alignCenter: newAlignCenter
        }

        console.log(111)
        console.log(blockStyles.value)

        ctx.emit('update:block', blockStyles.value)
      }
    })

    return () => {
      // 通过block的key属性直接获取对应的组件
      const component = config.componentMap[props.block.key]

      // 获取render函数
      const RenderComponent = component.render()

      return (
        <div class="editor-block" style={blockStyles.value.get()} ref={blockRef}>
          {RenderComponent}
        </div>
      )
    }
  }
})
