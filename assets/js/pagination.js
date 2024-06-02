import { ref, computed } from 'vue'

export  default function usePagination(items, itemsPerPage = 10) {
  const currentPage = ref(1);
  const totalPages = computed(() => Math.ceil(items.value.length / itemsPerPage));

  const paginatedItems = computed(() => {
    const startIndex = (currentPage.value - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, items.value.length);
    return items.value.slice(startIndex, endIndex);
  });

  function nextPage() {
    if (currentPage.value < totalPages.value) {
      currentPage.value++;
    }
  }

  function prevPage() {
    if (currentPage.value > 1) {
      currentPage.value--;
    }
  }

  return { currentPage, totalPages, paginatedItems, nextPage, prevPage };
}
