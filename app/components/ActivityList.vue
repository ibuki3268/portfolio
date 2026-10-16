<script setup lang="ts">
import type { Activity } from '~/data/profile'

defineProps<{ items: Activity[] }>()
</script>

<template>
  <ol class="timeline">
    <li v-for="item in items" :key="item.title + item.date">
      <small class="muted">{{ item.date }}</small>
      <span class="tag">{{ item.category }}</span>
      <h3>{{ item.title }}</h3>
      <p>{{ item.description }}</p>
    </li>
  </ol>
</template>
