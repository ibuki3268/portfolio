<script setup lang="ts">
import { profile } from '~/data/profile'

const nav = [
  { to: '/', label: 'ホーム' },
  { to: '/works', label: '作品' },
  { to: '/career', label: '経歴' },
  { to: '/skills', label: '技術スタック' }
]
</script>

<template>
  <div class="site">
    <header class="header">
      <div class="container header-inner">
        <NuxtLink to="/" class="logo">{{ profile.nameEn }} Portfolio</NuxtLink>
        <nav class="nav">
          <NuxtLink v-for="item in nav" :key="item.to" :to="item.to">{{ item.label }}</NuxtLink>
        </nav>
      </div>
    </header>

    <main class="main">
      <slot />
    </main>

    <footer class="footer">
      <div class="container footer-inner">
        <nav class="nav">
          <NuxtLink v-for="item in nav" :key="item.to" :to="item.to">{{ item.label }}</NuxtLink>
        </nav>
        <div class="footer-links">
          <a :href="profile.links.github" target="_blank" rel="noopener">GitHub</a>
          <a :href="profile.links.twitter">X (Twitter)</a>
          <a :href="profile.links.email">Email</a>
        </div>
        <small>&copy; 2026 {{ profile.nameEn }}. All rights reserved.</small>
      </div>
    </footer>
  </div>
</template>
