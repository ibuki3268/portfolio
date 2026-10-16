<script setup lang="ts">
defineProps<{ title: string, moreTo?: string }>()
</script>

<template>
  <div class="section-heading">
    <h2>{{ title }}</h2>
    <NuxtLink v-if="moreTo" :to="moreTo" class="more">すべて見る →</NuxtLink>
  </div>
</template>
