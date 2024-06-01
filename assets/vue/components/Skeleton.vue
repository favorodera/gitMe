<script setup>
defineProps({
  skeletonHeight: Number,
  skeletonWidth: Number,
  skeletonRadius: Number,
  skeletonMaxWidth: Number
})
</script>

<template>
  <div
    :style="{
      width: skeletonWidth + '%',
      height: skeletonHeight + '%',
      borderRadius: skeletonRadius + 'rem',
      maxWidth: skeletonMaxWidth + 'rem'
    }"
    class="skeleton"
  ></div>
</template>

<style scoped>
.skeleton {
  background-color: #1d1c2979;
  animation: pulse 1.2s 1.2s ease-in-out alternate infinite;
}

@keyframes pulse {
  0% {
    opacity: 1;
  }

  50% {
    opacity: 0.4;
  }

  100% {
    opacity: 1;
  }
}
</style>
