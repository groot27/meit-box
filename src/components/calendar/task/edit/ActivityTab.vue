<script setup lang="ts">
import { ref, computed } from "vue";
import { useI18n } from "vue-i18n";
import { format } from "date-fns";
import { ActivityComment, ActivityHistory } from "@/types/TaskTypes";

const { t } = useI18n();

const props = defineProps<{
  comments: ActivityComment[];
  history: ActivityHistory[];
}>();

const activityFilter = ref<"all" | "comments" | "history">("all");
const currentPage = ref(1);
const itemsPerPage = 5;

const filteredActivity = computed(() => {
  let items: (ActivityComment | ActivityHistory)[] = [];
  switch (activityFilter.value) {
    case "comments":
      if (props.comments && props.comments.length) {
        items = props.comments.map((comment) => ({
          ...comment,
          status: "comment",
        }));
      }
      break;
    case "history":
      if (props.history && props.history.length) {
        items = props.history.map((history) => ({
          ...history,
          status: "history",
        }));
      }
      break;
    default:
      if (
        (props.history && props.history.length) ||
        (props.comments && props.comments.length)
      ) {
        items = [
          ...props.comments.map((comment) => ({
            ...comment,
            status: "comment",
          })),
          ...props.history.map((history) => ({
            ...history,
            status: "history",
          })),
        ];
      }
    // .sort(
    //   (a, b) =>
    //     new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    // );
  }

  return items;
});

const paginatedActivity = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return filteredActivity.value.slice(start, end);
});

const totalPages = computed(() =>
  Math.ceil(filteredActivity.value.length / itemsPerPage)
);

const handleFilterChange = (filter: "all" | "comments" | "history") => {
  activityFilter.value = filter;
  currentPage.value = 1;
};

const handlePageChange = (page: number) => {
  currentPage.value = page;
};

const formatDate = (timestamp: string) => {
  return format(new Date(timestamp), "MMM d, yyyy h:mm a");
};
</script>

<template>
  <div class="space-y-4">
    <!-- Filter -->
    <div class="flex space-x-2 border-b pb-4">
      <button
        v-for="filter in ['all', 'comments', 'history']"
        :key="filter"
        type="button"
        @click="handleFilterChange(filter as 'all' | 'comments' | 'history')"
        class="px-3 py-1 text-sm font-medium rounded-full"
        :class="
          activityFilter === filter
            ? 'bg-gray-200 text-gray-800'
            : 'text-gray-500 hover:bg-gray-100'
        "
      >
        {{ t(`task.modal.sections.activity.filters.${filter}`) }}
      </button>
    </div>

    <!-- Activity List -->
    <div class="space-y-4" v-if="paginatedActivity">
      <template v-for="item in paginatedActivity" :key="item.id">
        <div class="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
          <div
            class="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center"
          >
            <font-awesome-icon
              icon="fa-solid fa-comment"
              class="text-gray-500"
              v-show="item.status === 'comment'"
            />
            <font-awesome-icon
              icon="fa-solid fa-history"
              class="text-gray-500"
              v-show="item.status === 'history'"
            />
          </div>
          <div class="flex-1">
            <div class="flex items-center justify-between">
              <span class="font-medium text-gray-900">{{
                item.user.username
              }}</span>
              <span
                class="text-sm text-gray-500 right-0"
                v-show="item.status === 'history'"
                >{{ formatDate(item.created_at) }}</span
              >
            </div>
            <p class="text-gray-700 mt-1" v-show="item.status === 'history'">
              {{ item.type }}
            </p>
            <p class="text-gray-700 mt-1" v-show="item.status === 'comment'">
              {{ item.comment }}
            </p>
          </div>
        </div>
      </template>
    </div>

    <!-- Pagination -->
    <div v-if="totalPages > 1" class="flex justify-center space-x-2 pt-4">
      <button
        v-for="page in totalPages"
        :key="page"
        type="button"
        @click="handlePageChange(page)"
        class="px-3 py-1 text-sm font-medium rounded"
        :class="
          currentPage === page
            ? 'bg-gray-800 text-white'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        "
      >
        {{ page }}
      </button>
    </div>
  </div>
</template>
```
