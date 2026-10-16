<script setup lang="ts">
import type { Work } from '~/data/profile'

defineProps<{ work: Work }>()
</script>

<template>
  <article class="card">
    <div class="thumb">No Image</div>
    <small class="muted">{{ work.date }}</small>
    <h3>{{ work.title }}</h3>
    <p>{{ work.description }}</p>
    <ul class="tags">
      <li v-for="tag in work.tags" :key="tag">{{ tag }}</li>
    </ul>
  </article>
</template>
