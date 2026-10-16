<script setup lang="ts">
import type { Skill } from '~/data/profile'

defineProps<{ items: Skill[] }>()
</script>

<template>
  <ul class="grid grid-skills">
    <li v-for="skill in items" :key="skill.name" class="card skill">
      <div class="skill-icon">{{ skill.name.charAt(0) }}</div>
      <div>
        <strong>{{ skill.name }}</strong>
        <small class="muted">{{ skill.level }}</small>
      </div>
    </li>
  </ul>
</template>
