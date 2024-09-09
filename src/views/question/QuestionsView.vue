<template>
  <div id="questionsView">
    <h2>题目浏览</h2>
    <a-form :model="searchParams" :layout="'inline'" class="searchBox">
      <a-form-item field="title" label="题目名称" style="min-width: 300px">
        <a-input v-model="searchParams.title" placeholder="请输入题目名称..." />
      </a-form-item>
      <a-form-item field="tags" label="标签" style="min-width: 300px">
        <a-input-tag
          v-model="searchParams.tags"
          placeholder="请输入标签(输入后回车)..."
        />
      </a-form-item>
      <a-form-item class="search-button">
        <a-button type="primary" @click="doSearch"> 搜索</a-button>
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
      <template #tags="{ record }">
        <a-space wrap>
          <a-tag v-for="(tag, index) of record.tags" :key="index" color="green">
            {{ tag }}
          </a-tag>
        </a-space>
      </template>
      <template #acceptedRate="{ record }">
        {{
          `${record.submitNum ? record.acceptedNum / record.submitNum : "0"}%
          (${record.acceptedNum}/${record.submitNum})`
        }}
      </template>
      <template #createTime="{ record }">
        {{ moment(record.createTime).format("YYYY-MM-DD") }}
      </template>
      <template #optional="{ record }">
        <a-space>
          <a-button
            type="primary"
            shape="round"
            @click="toQuestionPage(record)"
          >
            做题
          </a-button>
        </a-space>
      </template>
    </a-table>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watchEffect } from "vue";
import {
  Question,
  QuestionControllerService,
  QuestionQueryRequest,
} from "../../../generated";
import { Message } from "@arco-design/web-vue";
import { useRouter } from "vue-router";
import moment from "moment";

const dataList = ref([]); // 保存所有题目的列表
const total = ref(0); // 题目总数
const router = useRouter();

// 分页查找参数
const searchParams = ref<QuestionQueryRequest>({
  title: "",
  tags: [],
  pageSize: 10,
  current: 1,
});

/**
 * 通过分页查找参数向后端请求数据，将数据保存到dataList和total变量中
 */
const loadData = async () => {
  const res = await QuestionControllerService.listQuestionVoByPageUsingPost(
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
    title: "题号",
    dataIndex: "id",
  },
  {
    title: "题目名称",
    dataIndex: "title",
  },
  {
    title: "标签",
    slotName: "tags",
  },
  {
    title: "通过率(通过数/提交数)",
    slotName: "acceptedRate",
  },
  {
    title: "创建时间",
    slotName: "createTime",
  },
  {
    title: "",
    slotName: "optional",
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
    title: "",
    tags: [],
  };
};
</script>

<style scoped>
#questionsView {
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
