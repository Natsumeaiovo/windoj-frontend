<template>
  <div class="home">
    获取到MonacoEditor中代码：{{ codeValue }}
    <CodeEditor :value="codeValue" :handle-change="onCodeChange" />
    <MdEditor :value="mdValue" :handle-change="onMdChange" />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import MdEditor from "@/components/MdEditor.vue";
import CodeEditor from "@/components/CodeEditor.vue";

const mdValue = ref();
const codeValue = ref();

const onMdChange = (v: string) => {
  // console.log("编辑文本时，onChange触发");
  mdValue.value = v;
  console.log(v);
};

const onCodeChange = (v: string) => {
  // console.log("编辑文本时，onChange触发");
  codeValue.value = v;
  console.log(v);
};
</script>
