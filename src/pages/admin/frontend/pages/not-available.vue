<template>
  <Nav></Nav>
  <div class="coming-soon-container">
    <h1>الصفحة ستكون متاحة قريبًا</h1>
    <p>نعمل بجد لتقديم أفضل تجربة لكم. ترقبوا المزيد!</p>
  </div>
</template>

<script setup>
import Nav from '../components/nav.vue';


</script>

<style scoped>
.coming-soon-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 90vh;
  background-color: #f8fafc;
  text-align: center;
  padding: 20px;
}

h1 {
  font-size: 2.5rem;
  color: #1e293b;
  margin-bottom: 1rem;
  font-weight: 600;
}

p {
  font-size: 1.2rem;
  color: #64748b;
  max-width: 600px;
}
</style>
