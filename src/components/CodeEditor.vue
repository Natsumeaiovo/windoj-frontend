<template>
  <div
    id="code-editor"
    ref="codeEditorRef"
    style="min-height: 600px; height: 80vh"
  />
</template>

<script setup lang="ts">
import * as monaco from "monaco-editor";
import { onMounted, ref, toRaw, withDefaults, defineProps, watch } from "vue";

/**
 * 定义组件属性类型
 */
interface Props {
  value: string;
  language: string;
  handleChange: (v: string) => void;
}

/**
 * 给组件指定默认值
 */
const props = withDefaults(defineProps<Props>(), {
  value: () => "",
  language: () => "java",
  handleChange: (v: string) => {
    console.log(v);
  },
});

const codeEditorRef = ref();
const codeEditorObj = ref();

watch(
  () => props.language,
  () => {
    // 改变代码编辑器的语言
    if (codeEditorObj.value) {
      monaco.editor.setModelLanguage(
        toRaw(codeEditorObj.value).getModel(),
        props.language
      );
    }
  }
);

onMounted(() => {
  // 实例必须存在，否则返回
  if (!codeEditorRef.value) {
    return;
  }
  codeEditorObj.value = monaco.editor.create(codeEditorRef.value, {
    value: props.value, // 默认显示的值
    language: props.language,
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
