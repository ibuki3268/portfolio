<script setup lang="ts">
import { activities } from '~/data/profile'

useHead({ title: '経歴 | Ibuki Portfolio' })
</script>

<template>
  <div class="container section">
    <h1>経歴・活動</h1>
    <ActivityList :items="activities" />
  </div>
</template>
