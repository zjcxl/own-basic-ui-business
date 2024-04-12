<script lang="ts" setup>
import { NConfigProvider, dateZhCN, zhCN } from 'naive-ui'
import hljs from 'highlight.js/lib/core'
import json from 'highlight.js/lib/languages/json'

hljs.registerLanguage('json', json)
</script>

<template>
  <NConfigProvider :date-locale="dateZhCN" :hljs="hljs" :locale="zhCN">
    <div class="p4">
      <router-view />
    </div>
  </NConfigProvider>
</template>
