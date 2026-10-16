<script setup lang="ts">
import { works } from '~/data/profile'

useHead({ title: '作品 | Ibuki Portfolio' })
</script>

<template>
  <div class="container section">
    <h1>作品一覧</h1>
    <div class="grid grid-cards">
      <WorkCard v-for="w in works" :key="w.title" :work="w" />
    </div>
  </div>
</template>
