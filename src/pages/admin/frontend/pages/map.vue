<template>
  <Nav></Nav>
  <div class="map-section">
    <div class="map-header">
      <h2>خريطة منطقة التل </h2>
      <p></p>
    </div>

    <div class="map-wrapper">
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d126316.41904051819!2d36.45438861130511!3d33.70003363230452!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1518ece7cf983c2f%3A0xc305a0f4a3fa4681!2z2YXZhti32YLYqSDYp9mE2KrZhNiMINiz2YjYsdmK2Kc!5e0!3m2!1sar!2seg!4v1750848120093!5m2!1sar!2seg"
        class="map-iframe"
        loading="lazy"
        referrerpolicy="no-referrer-when-downgrade">
      </iframe>
    </div>
  </div>
  <Footer></Footer>
</template>

<script setup>
import Nav from '../components/nav.vue';
import Footer from '../components/footer.vue';
</script>

<style scoped>
.map-section {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 3rem 1rem;
  text-align: center;
}

.map-header h2 {
  font-size: 2.5rem;
  color: #2c3e50;
  margin-bottom: 0.5rem;
}

.map-header p {
  font-size: 1.2rem;
  color: #7f8c8d;
  margin-bottom: 2rem;
}

.map-wrapper {
  position: relative;
  padding: 1px;
  background: linear-gradient(145deg, #ffffff, #e6e6e6);
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  display: inline-block;
  overflow: hidden;
}

.map-iframe {
  display: block;
  width: 800px;
  height: 500px;
  border: none;
  border-radius: 10px;
  transition: all 0.3s ease;
  box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.05);
}

.map-iframe:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.12);
}

@media (max-width: 900px) {
  .map-iframe {
    width: 100%;
    height: 400px;
  }
}

@media (max-width: 600px) {
  .map-header h2 {
    font-size: 2rem;
  }

  .map-header p {
    font-size: 1rem;
  }

  .map-iframe {
    height: 300px;
  }
}
</style>
