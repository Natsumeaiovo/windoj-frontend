<template>
  <div id="doQuestionView">
    <a-row :gutter="[24, 24]">
      <a-col :md="12" :xs="24">
        <a-tabs default-active-key="question" type="card-gutter">
          <a-tab-pane key="question" title="题目">
            <a-card v-if="question" :title="question.title">
              <template #extra>
                <a-space wrap style="margin-top: 8px">
                  <a-tag
                    v-for="(tag, index) of question.tags"
                    :key="index"
                    color="green"
                  >
                    {{ tag }}
                  </a-tag>
                </a-space>
              </template>
              <a-descriptions
                title="判题条件"
                :column="{ xs: 1, md: 3 }"
                style="max-width: 680px"
              >
                <a-descriptions-item label="时间限制">
                  <a-tag>{{ question.judgeConfig.timeLimit ?? 0 }}ms</a-tag>
                </a-descriptions-item>
                <a-descriptions-item label="内存限制">
                  <a-tag>{{ question.judgeConfig.memoryLimit ?? 0 }}KB</a-tag>
                </a-descriptions-item>
                <a-descriptions-item label="堆栈限制">
                  <a-tag>{{ question.judgeConfig.stackLimit ?? 0 }}KB</a-tag>
                </a-descriptions-item>
              </a-descriptions>
              <MdViewer :value="question.content" />
            </a-card>
          </a-tab-pane>
          <a-tab-pane key="comment" title="评论"> 评论区</a-tab-pane>
          <a-tab-pane key="answer" title="题解">
            Content of Tab Panel 3
          </a-tab-pane>
        </a-tabs>
      </a-col>
      <a-col :md="12" :xs="24" class="codeEditor">
        <a-form :model="form" :layout="'inline'" class="searchBox">
          <a-form-item
            field="language"
            label="编程语言"
            style="min-width: 300px"
          >
            <a-select
              v-model="form.language"
              :style="{ width: '200px' }"
              placeholder="选择编程语言"
            >
              <a-option value="java">Java</a-option>
              <a-option value="cpp">C++</a-option>
              <a-option value="go">GoLang</a-option>
              <a-option>html</a-option>
            </a-select>
          </a-form-item>
          <a-form-item>
            <a-button type="primary" style="min-width: 200px" @click="doSubmit">
              提交代码
            </a-button>
          </a-form-item>
        </a-form>
        <CodeEditor
          :value="form.code"
          :language="form.language"
          :handle-change="onCodeChange"
        />
      </a-col>
    </a-row>
  </div>
</template>

<script setup lang="ts">
import { defineProps, onMounted, ref, withDefaults } from "vue";
import {
  QuestionControllerService,
  QuestionSubmitAddRequest,
  QuestionSubmitControllerService,
  QuestionVO,
} from "../../../generated";
import { Message } from "@arco-design/web-vue";
import CodeEditor from "@/components/CodeEditor.vue";
import MdViewer from "@/components/MdViewer.vue";

const question = ref<QuestionVO>();

interface Props {
  id: string;
}

const props = withDefaults(defineProps<Props>(), {
  id: () => "",
});

/**
 * 通过分页查找参数向后端请求数据，将数据保存到dataList和total变量中
 */
const loadData = async () => {
  const res = await QuestionControllerService.getQuestionVoByIdUsingGet(
    props.id as any
  );
  if (res.code === 0) {
    question.value = res.data;
  } else {
    Message.error("加载失败，" + res.message);
  }
};

/**
 * 页面加载时，请求数据
 */
onMounted(() => {
  loadData();
});

const form = ref<QuestionSubmitAddRequest>({
  questionId: Number(props.id),
  language: "java",
  code: "",
});
/**
 * 提交代码
 */
const doSubmit = async () => {
  const res = await QuestionSubmitControllerService.doQuestionSubmitUsingPost(
    form.value as QuestionSubmitAddRequest
  );
  if (res.code === 0) {
    Message.success("提交代码成功！");
  } else {
    Message.error("提交失败！" + res.message);
  }
};

const onCodeChange = (value: string) => {
  form.value.code = value;
};
</script>

<style scoped>
#doQuestionView {
  display: flex;
  flex-direction: column;
  max-width: 1920px;
  margin: 0 auto;

  h2 {
    margin: 0 auto 20px;
  }

  .codeEditor {
    margin-top: 30px;
  }
}
</style>

<style>
#doQuestionView {
  .arco-tabs-content {
    padding: 0;
  }
}
</style>
