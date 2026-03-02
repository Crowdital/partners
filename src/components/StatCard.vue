<template>
  <v-card class="stat-card hover-card pa-4" :style="{ background: background }">
    <div class="stat-content">
      <!-- Left content -->
      <div class="stat-text">
        <div class="card-title">{{ title }}</div>
        <div class="card-value">{{ value }}</div>
        <div class="card-subtext" v-if="subtext">{{ subtext }}</div>
      </div>

      <!-- Right icon -->
      <div class="stat-icon">
        <v-icon :size="40" color="#0f9d58">{{ icon }}</v-icon>
      </div>
    </div>
  </v-card>
</template>

<script setup>
import { VCard, VIcon } from 'vuetify/components'

defineProps({
  title: String,
  value: [String, Number],
  subtext: String,
  icon: { type: String, default: 'mdi-chart-bar' }, // Material Design Icon
  iconColor: { type: String, default: '#0f2638 ' }, // fintech primary color
  textColor: {type: String, default: '#64cf69'},
   background: {
    type: String,
    default: '#FFFFFF',
  },
})
</script>

<style scoped>
.stat-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-radius: 10px;
  min-height: 140px;
  transition: transform 0.2s, box-shadow 0.2s;
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
  background: #fff;
}

.hover-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(0,0,0,0.12);
}

.stat-content {
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: center;
}

.stat-text {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.card-title {
  font-size: 14px;
  color: #555;
  font-weight: 500;
}

.card-value {
  font-size: 28px;
  font-weight: 700;
  color: #0a3d62;
  margin: 4px 0;
}

.card-subtext {
  font-size: 12px;
  color: #888;
}

.stat-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  /* background-color: var(--icon-bg, #0f9d58); fallback color */
}
</style>
