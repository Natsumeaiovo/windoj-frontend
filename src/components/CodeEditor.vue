<template>
  <div id="code-editor" ref="codeEditorRef" style="min-height: 400px" />
</template>

<script setup lang="ts">
import * as monaco from "monaco-editor";
import { onMounted, ref, toRaw, withDefaults, defineProps } from "vue";

/**
 * 定义组件属性类型
 */
interface Props {
  value: string;
  handleChange: (v: string) => void;
}

/**
 * 给组件指定初始值
 */
const props = withDefaults(defineProps<Props>(), {
  value: () => "",
  handleChange: (v: string) => {
    console.log(v);
  },
});

const codeEditorRef = ref();
const codeEditorObj = ref();

onMounted(() => {
  // 实例必须存在，否则返回
  if (!codeEditorRef.value) {
    return;
  }
  codeEditorObj.value = monaco.editor.create(codeEditorRef.value, {
    value: props.value, // 默认显示的值
    language: "java",
    automaticLayout: true, // 自动布局
    colorDecorators: true, // 颜色装饰器
    minimap: {
      enabled: true, // 开启小地图
    },
    // lineNumbers: "off", // 行号，取值： "on" | "off" | "relative" | "interval" | function
    roundedSelection: true, // 选中时是圆角效果
    // scrollBeyondLastLine: false, // 用鼠标滚轮滑到最后一行
    readOnly: false,
    theme: "vs-dark",
  });

  // 编辑 监听内容变化
  codeEditorObj.value.onDidChangeModelContent(() => {
    props.handleChange(toRaw(codeEditorObj.value).getValue());
  });
});
</script>

<style scoped></style>
