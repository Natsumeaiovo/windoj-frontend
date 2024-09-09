<template>
  <div id="addQuestionView">
    <a-form :model="form" label-align="right" @submit="handleSubmit">
      <a-form-item field="pageFunc">
        <h1>{{ title }}</h1>
      </a-form-item>
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
              style="margin-bottom: 12px"
            >
              删除测试用例{{ index + 1 }}
            </a-button>
          </a-space>
        </a-form-item>
        <a-button @click="handleAdd" type="outline" status="success">
          新增测试用例
        </a-button>
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
import { onMounted, ref, watch } from "vue";
import { QuestionControllerService } from "../../../generated";
import { Message } from "@arco-design/web-vue";
import { useRoute, useRouter } from "vue-router";

const title = ref("创建题目");
const route = useRoute();
const router = useRouter();
// 初始表单状态
const initForm = ref({
  title: "",
  tags: [],
  answer: "",
  content: "",
  judgeCase: [
    {
      input: "",
      output: "",
    },
  ],
  judgeConfig: {
    memoryLimit: 1000,
    stackLimit: 1000,
    timeLimit: 1000,
  },
});
const form = ref({ ...initForm.value });

// 如果页面地址包含update，视为更新页面
const isUpdatePage = route.path.includes("update");
// 如果要跳转到创建题目页面，那么更新标题，并更新表单到初始状态
watch(route, (newRoute) => {
  if (newRoute.path === "/add/question") {
    title.value = "创建题目";
    form.value = { ...initForm.value };
  }
});

onMounted(() => {
  // 如果是更新题目页面，那么获取该题目的信息
  if (isUpdatePage) {
    loadData();
  }
});

/**
 * 在更新页面，根据题目 id 获取该题目信息
 */
const loadData = async () => {
  const id = route.query.id;
  if (!id) {
    return;
  }
  title.value = "修改题目";
  const res = await QuestionControllerService.getQuestionByIdUsingGet(
    id as any
  );
  if (res.code === 0) {
    form.value = res.data as any;
    form.value.tags = JSON.parse(form.value.tags as any);
    if (!form.value.judgeConfig) {
      form.value.judgeConfig = {
        memoryLimit: 1000,
        stackLimit: 1000,
        timeLimit: 1000,
      };
    } else {
      form.value.judgeConfig = JSON.parse(form.value.judgeConfig as any);
    }
    if (!form.value.judgeCase) {
      form.value.judgeCase = [
        {
          input: "",
          output: "",
        },
      ];
    } else {
      form.value.judgeCase = JSON.parse(form.value.judgeCase as any);
    }
  } else {
    Message.error("加载失败！" + res.message);
  }
};

/**
 * 新增测试用例
 */
const handleAdd = () => {
  if (form.value.judgeCase) {
    form.value.judgeCase.push({
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
  if (form.value.judgeCase) {
    form.value.judgeCase.splice(index, 1);
  }
};

/**
 * 表单提交
 */
const handleSubmit = async () => {
  console.log(form);
  if (isUpdatePage) {
    // 如果是更新页面
    const res = await QuestionControllerService.updateQuestionUsingPost(
      form.value
    );
    if (res.code === 0) {
      Message.success("更新题目成功！");
      // 自动跳转到管理题目页
      await router.push("/manage/question");
    } else {
      Message.error("更新题目失败！" + res.message);
    }
  } else {
    // 如果是创建题目页面
    const res = await QuestionControllerService.addQuestionUsingPost(
      form.value
    );
    if (res.code === 0) {
      Message.success("创建题目成功！");
      // 自动跳转到浏览题目页
      await router.push("/questions");
    } else {
      Message.error("创建题目失败！" + res.message);
    }
  }
};

/**
 * MdEditor 题目内容 和 题目答案 变化时，将其内容填充到 form 中
 * @param value
 */
const onContentChange = (value: string) => {
  form.value.content = value;
};
const onAnswerChange = (value: string) => {
  form.value.answer = value;
};
</script>

<style scoped>
#addQuestionView {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  h1 {
    margin-bottom: 12px;
  }
}
</style>
