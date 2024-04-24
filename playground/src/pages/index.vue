<script lang="ts" setup>
const router = useRouter()
const routes = router.getRoutes()
</script>

<template>
  <div class="flex flex-col gap-2">
    <RouterLink v-for="item in routes" :key="item.path" :to="item.path" class="hover:color-red">
      {{ item.path }}
    </RouterLink>
  </div>
</template>
