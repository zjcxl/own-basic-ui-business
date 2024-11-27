<script lang="ts" setup>
import hljs from 'highlight.js/lib/core'
import json from 'highlight.js/lib/languages/json'
import { dateZhCN, NConfigProvider, zhCN } from 'naive-ui'

hljs.registerLanguage('json', json)
</script>

<template>
  <NConfigProvider :date-locale="dateZhCN" :hljs="hljs" :locale="zhCN">
    <div class="h-100vh p4">
      <router-view />
    </div>
  </NConfigProvider>
</template>
