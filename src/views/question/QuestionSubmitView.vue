<template>
  <div id="questionsSubmitView">
    <a-form :model="searchParams" :layout="'inline'" class="searchBox">
      <a-form-item field="questionId" label="题号" style="min-width: 300px">
        <a-input
          v-model="searchParams.questionId"
          placeholder="请输入题号..."
        />
      </a-form-item>
      <a-form-item field="language" label="编程语言" style="min-width: 300px">
        <a-select
          v-model="searchParams.language"
          :style="{ width: '200px' }"
          placeholder="选择编程语言"
        >
          <a-option value="java">Java</a-option>
          <a-option value="cpp">C++</a-option>
          <a-option value="go">GoLang</a-option>
          <a-option>html</a-option>
        </a-select>
      </a-form-item>
      <a-form-item class="search-button">
        <a-button type="primary" @click="doSearch">搜索</a-button>
      </a-form-item>
      <a-form-item>
        <a-button type="primary" status="warning" @click="resetSearch">
          重置
        </a-button>
      </a-form-item>
    </a-form>
    <a-table
      :columns="columns"
      :data="dataList"
      :pagination="{
        showTotal: true,
        pageSize: searchParams.pageSize,
        current: searchParams.current,
        total,
      }"
      @page-change="onPageChange"
    >
      <template #judgeInfo="{ record }">
        {{ JSON.stringify(record.judgeInfo) }}
      </template>
      <template #createTime="{ record }">
        {{ moment(record.createTime).format("YYYY-MM-DD HH:mm") }}
      </template>
      <!-- todo 使用超链接，点击题目跳转到对应做题页面 -->
    </a-table>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watchEffect } from "vue";
import {
  Question,
  QuestionControllerService,
  QuestionSubmitQueryRequest,
} from "../../../generated";
import { Message } from "@arco-design/web-vue";
import { useRouter } from "vue-router";
import moment from "moment";

const dataList = ref([]); // 保存所有题目的列表
const total = ref(0); // 题目总数
const router = useRouter();

// 分页查找参数
const searchParams = ref<QuestionSubmitQueryRequest>({
  questionId: undefined,
  language: "",
  pageSize: 10,
  current: 1,
  sortField: "createTime",
  sortOrder: "descend",
});

/**
 * 通过分页查找参数向后端请求数据，将数据保存到dataList和total变量中
 */
const loadData = async () => {
  const res = await QuestionControllerService.listQuestionSubmitByPageUsingPost(
    searchParams.value
  );
  // console.log(res);
  if (res.code === 0) {
    dataList.value = res.data.records;
    total.value = res.data.total;
  } else {
    Message.error("加载失败，" + res.message);
  }
};

/**
 * 监听searchParams变量，改变时触发页面的重新加载，在Vue3中，
 * watchEffect 函数会自动跟踪其函数体内部访问的响应式数据源。
 * 当在 watchEffect 的函数体内部访问 searchParams 时，Vue 会自动将 searchParams 添加到依赖列表中。
 */
watchEffect(() => {
  loadData();
});

/**
 * 页面加载时，请求数据
 */
onMounted(() => {
  loadData();
});

const columns = [
  {
    title: "题目 id",
    dataIndex: "questionId",
  },
  {
    title: "编程语言",
    dataIndex: "language",
  },
  {
    title: "判题信息",
    slotName: "judgeInfo",
  },
  {
    title: "判题状态",
    dataIndex: "status",
  },
  {
    title: "用户 id",
    dataIndex: "userId",
  },
  {
    title: "提交号",
    dataIndex: "id",
  },
  {
    title: "创建时间",
    slotName: "createTime",
  },
];

/**
 * 浏览题目页面翻页
 * @param page
 */
const onPageChange = (page: number) => {
  searchParams.value = {
    ...searchParams.value,
    current: page,
  };
};

/**
 * 跳转到做题页面
 * @param question
 */
const toQuestionPage = (question: Question) => {
  router.push({
    path: `/view/question/${question.id}`,
  });
};

/**
 * 确认搜索，重新加载数据，注意需要重置搜索页号
 */
const doSearch = () => {
  searchParams.value = {
    ...searchParams.value,
    current: 1, // 重置搜索页号
  };
};

/**
 * 重置搜索条件
 */
const resetSearch = () => {
  searchParams.value = {
    ...searchParams.value,
    questionId: undefined,
    language: "",
  };
};
</script>

<style scoped>
#questionsSubmitView {
  display: flex;
  flex-direction: column;
  max-width: 1280px;
  margin: 0 auto;

  h2 {
    margin: 0 auto 20px;
  }

  .searchBox {
    margin-bottom: 16px;
    justify-content: center;
  }

  .search-button {
    margin-right: 0;
  }
}
</style>
