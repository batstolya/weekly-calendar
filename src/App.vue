<script>
import Calendar from './components/Calendar.vue';

export default {
  components: {
    Calendar,
  },
};
</script>

<template>
  <main class="main">
    <div class="content">
      <h1 class="title">Set Schedule</h1>
      <Calendar />
    </div>
  </main>
</template>

<style>
.main {
  margin-top: 50px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.title {
  align-self: flex-start;
}
</style>
