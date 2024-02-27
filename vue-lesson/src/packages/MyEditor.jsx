import { ref, inject, computed, onMounted, defineComponent } from 'vue'
import MyEditorBlock from './MyEditorBlock'
import deepcopy from 'deepcopy'

import './editor.scss'

export default defineComponent({
  props: {
    modelValue: {
      type: Object
    }
  },
  emits: ['update:modelValue'],      // 要触发的事件
  setup(props, ctx) {
    const data = computed({
      get() {
        return props.modelValue
      },
      set(newVal) {
        ctx.emit('update:modelValue', deepcopy(newVal))
      }
    })

    const containerStyles = computed(() => ({
      width: data.value.container.width + 'px',
      height: data.value.container.height + 'px'
    }))

    const config = inject('config')

    let currentComponent = null
    const containerRef = ref(null)

    const dragenter = (e) => {
      e.dataTransfer.dropEffect = 'move'
    }

    const dragover = (e) => {
      e.preventDefault()
    }

    const dragleave = (e) => {
      e.dataTransfer.dropEffect = 'none'
    }

    const drop = (e) => {
      // 先留在这
      console.log(e)
      console.log(currentComponent)

      let blocks = data.value.blocks

      data.value = {
        ...data.value,
        blocks: [
          ...blocks,
          {
            top: e.offsetY,
            left: e.offsetX,
            zIndex: 1,
            key: currentComponent.key,
            alignCenter: true,
          }
        ]
      }

      currentComponent = null
    }

    const dragstart = (e, component) => {
      console.log(e, component)
      console.log(containerRef.value)

      currentComponent = component
    }

    onMounted(() => {
      // dragenter 进入元素中, 添加一个移动标识
      // dragover 在目标元素经过, 必须阻止默认行为, 否则不能触发drop
      // dragleave 离开元素的时候, 需要增加一个禁用标识
      // drop 松手的时候, 根据拖拽的组件, 添加一个组件
      containerRef.value.addEventListener('dragenter', dragenter)
      containerRef.value.addEventListener('dragover', dragover)
      containerRef.value.addEventListener('dragleave', dragleave)
      containerRef.value.addEventListener('drop', drop)
    })

    return () => <div class="editor">
      <div class="editor-left">
        {/* 根据注册列表 渲染对应的内容 可以实现h5拖拽 */}
        {config.componentList.map(component => (
          <div class="editor-left-item"
            draggable
            onDragstart={e => dragstart(e, component)}
          >
            <span>{component.label}</span>
            <div>{component.preview()}</div>
          </div>
      ))}
      </div>
      <div class="editor-top">菜单栏</div>
      <div class="editor-right">属性控制栏目</div>
      <div class="editor-container">
        {/* 负责产生滚动条 */}
        <div class="editor-container-canvas">
          {/* 产生内容区域 */}
          <div class="editor-container-canvas__content" style={containerStyles.value} ref={containerRef}>
            { (data.value.blocks).map(block => (
              <MyEditorBlock block={block} />
            )) }
          </div>
        </div>
      </div>
    </div>
  }
})
