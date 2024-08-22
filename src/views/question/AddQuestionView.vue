<template>
  <div id="addQuestionView">
    <h1>创建题目</h1>
    <a-form :model="form" label-align="right" @submit="handleSubmit">
      <a-form-item field="title" label="标题">
        <a-input
          v-model="form.title"
          placeholder="请输入标题"
          :style="{ width: '640px' }"
        />
      </a-form-item>
      <a-form-item field="tags" label="标签">
        <a-input-tag
          v-model="form.tags"
          :style="{ width: '640px' }"
          placeholder="请选择标签"
          allow-clear
        />
      </a-form-item>
      <a-form-item field="content" label="题目内容">
        <MdEditor :value="form.content" :handle-change="onContentChange" />
      </a-form-item>
      <a-form-item field="answer" label="答案">
        <MdEditor :value="form.answer" :handle-change="onAnswerChange" />
      </a-form-item>

      <!----------------------------- 判题设置 -------------------------------->
      <a-form-item label="判题设置" :content-flex="false" :merge-props="false">
        <a-space direction="vertical" style="min-width: 480px">
          <a-form-item field="judgeConfig.timeLimit" label="时间限制/ms">
            <a-input-number
              v-model="form.judgeConfig.timeLimit"
              placeholder="请输入时间限制..."
              min="0"
              mode="button"
            />
          </a-form-item>
          <a-form-item field="judgeConfig.timeLimit" label="内存限制/KB">
            <a-input-number
              v-model="form.judgeConfig.memoryLimit"
              placeholder="请输入内存限制..."
              min="0"
              mode="button"
            />
          </a-form-item>
          <a-form-item field="judgeConfig.timeLimit" label="堆栈限制/KB">
            <a-input-number
              v-model="form.judgeConfig.stackLimit"
              placeholder="请输入堆栈限制..."
              min="0"
              mode="button"
            />
          </a-form-item>
        </a-space>
      </a-form-item>

      <!----------------------------- 测试用例配置 ----------------------------->
      <a-form-item
        label="测试用例配置"
        :content-flex="false"
        :merge-props="false"
      >
        <a-form-item
          v-for="(caseItem, index) of form.judgeCase"
          :key="index"
          style="display: flex; flex-direction: column"
        >
          <a-space direction="vertical" style="min-width: 480px">
            <a-form-item
              :field="`form.judgeCase[${index}].input`"
              :label="`输入用例${index + 1}`"
              :key="index"
            >
              <a-input v-model="caseItem.input" placeholder="输入用例" />
            </a-form-item>
            <a-form-item
              :field="`form.judgeCase[${index}].output`"
              :label="`输出用例${index + 1}`"
              :key="index"
            >
              <a-input v-model="caseItem.output" placeholder="输出用例" />
            </a-form-item>
            <a-button
              status="danger"
              @click="handleDelete(index)"
              style="margin-bottom: 16px"
            >
              删除测试用例{{ index + 1 }}
            </a-button>
          </a-space>
        </a-form-item>
        <div>
          <a-button @click="handleAdd" type="outline" status="success">
            新增测试用例
          </a-button>
        </div>
      </a-form-item>

      <!------------------------ 提交 ---------------------------------->
      <a-form-item>
        <a-button type="primary" style="min-width: 200px" @click="handleSubmit">
          提交
        </a-button>
      </a-form-item>
    </a-form>
  </div>
</template>

<script setup lang="ts">
import MdEditor from "@/components/MdEditor.vue";
import { reactive } from "vue";
import {
  QuestionAddRequest,
  QuestionControllerService,
} from "../../../generated";
import { Message } from "@arco-design/web-vue";

const form = reactive({
  title: "A + B",
  tags: ["栈", "简单"],
  answer: "暴力破解",
  content: "题目内容",
  judgeCase: [
    {
      input: "1 2",
      output: "3 4",
    },
  ],
  judgeConfig: {
    memoryLimit: 1000,
    stackLimit: 1000,
    timeLimit: 1000,
  },
});
/**
 * 新增测试用例
 */
const handleAdd = () => {
  if (form.judgeCase) {
    form.judgeCase.push({
      input: "",
      output: "",
    });
  }
};
/**
 * 删除测试用例
 * @param index
 */
const handleDelete = (index: number) => {
  if (form.judgeCase) {
    form.judgeCase.splice(index, 1);
  }
};

/**
 * 表单提交
 */
const handleSubmit = async () => {
  console.log(form);
  const res = await QuestionControllerService.addQuestionUsingPost(form);
  if (res.code === 0) {
    Message.success("创建题目成功！");
  } else {
    Message.error("创建题目失败！" + res.message);
  }
};

/**
 * MdEditor 内容和答案变化时，将其内容填充到 form 中
 * @param value
 */
const onContentChange = (value: string) => {
  form.content = value;
};
const onAnswerChange = (value: string) => {
  form.answer = value;
};
</script>

<style scoped>
#addQuestionView {
  h1 {
    margin-top: 0;
    margin-bottom: 20px;
    margin-left: 720px;
  }
}
</style>
