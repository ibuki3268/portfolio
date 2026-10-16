<script setup lang="ts">
import { skills } from '~/data/profile'

useHead({ title: '技術スタック | Ibuki Portfolio' })

const categories = [...new Set(skills.map(s => s.category))]
</script>

<template>
  <div class="container section">
    <h1>技術スタック</h1>
    <section v-for="cat in categories" :key="cat" class="section">
      <SectionHeading :title="cat" />
      <SkillGrid :items="skills.filter(s => s.category === cat)" />
    </section>
  </div>
</template>
