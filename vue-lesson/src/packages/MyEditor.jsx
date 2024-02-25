import { inject, computed, defineComponent } from 'vue'
import MyEditorBlock from './MyEditorBlock'

import './editor.scss'

export default defineComponent({
  props: {
    modelValue: {
      type: Object
    }
  },
  setup(props) {
    const data = computed({
      get() {
        return props.modelValue
      }
    })

    const containerStyles = computed(() => ({
      width: data.value.container.width + 'px',
      height: data.value.container.height + 'px'
    }))

    const config = inject('config')

    return () => <div class="editor">
      <div class="editor-left">
        {config.componentList.map(component => (
          <div class="editor-left-item">
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
          <div class="editor-container-canvas__content" style={containerStyles.value}>
            { (data.value.blocks).map(block => (
              <MyEditorBlock block={block} />
            )) }
          </div>
        </div>
      </div>
    </div>
  }
})
