<script setup lang="ts">
import { profile, stats, skills, works, activities } from '~/data/profile'
</script>

<template>
  <div class="container">
    <!-- Hero -->
    <section class="hero">
      <div class="avatar">Photo</div>
      <div>
        <h1>{{ profile.name }} <span class="muted">| {{ profile.nameEn }}</span></h1>
        <p class="role">{{ profile.role }}</p>
        <p>{{ profile.catchphrase }}</p>
        <div class="buttons">
          <NuxtLink to="/works" class="btn btn-primary">作品を見る</NuxtLink>
          <NuxtLink to="/career" class="btn">経歴を確認</NuxtLink>
          <a :href="profile.links.github" target="_blank" rel="noopener" class="btn">GitHub</a>
        </div>
      </div>
    </section>

    <!-- Stats -->
    <section class="section">
      <ul class="grid grid-stats">
        <li v-for="s in stats" :key="s.label" class="card stat">
          <strong>{{ s.value }}</strong>
          <small class="muted">{{ s.label }}</small>
        </li>
      </ul>
    </section>

    <!-- About -->
    <section class="section">
      <SectionHeading title="About Me" />
      <p v-for="line in profile.about" :key="line">{{ line }}</p>
    </section>

    <!-- Vision -->
    <section class="section">
      <SectionHeading title="Vision" />
      <p>{{ profile.vision }}</p>
    </section>

    <!-- Skills -->
    <section class="section">
      <SectionHeading title="技術スタック" more-to="/skills" />
      <SkillGrid :items="skills.slice(0, 6)" />
    </section>

    <!-- Works -->
    <section class="section">
      <SectionHeading title="最近の作品" more-to="/works" />
      <div class="grid grid-cards">
        <WorkCard v-for="w in works.slice(0, 3)" :key="w.title" :work="w" />
      </div>
    </section>

    <!-- Activities -->
    <section class="section">
      <SectionHeading title="最近の活動" more-to="/career" />
      <ActivityList :items="activities.slice(0, 3)" />
    </section>

    <!-- Links -->
    <section class="section">
      <SectionHeading title="関連リンク" />
      <div class="buttons">
        <a :href="profile.links.github" target="_blank" rel="noopener" class="btn">GitHub</a>
        <a :href="profile.links.twitter" class="btn">X (Twitter)</a>
        <a :href="profile.links.email" class="btn">Email</a>
      </div>
    </section>
  </div>
</template>
