<script setup>
import { ref } from 'vue'
</script>

<template>
  <section class="left-tabs-container">
    <div class="profile-header-tab">
      <div class="profile-image-container"><img :src="o" alt="" /></div>
      <p class="name"></p>
      <p class="bio"></p>
      <div class="follows">
        <p class="followers"></p>
        <p class="following"></p>
      </div>
    </div>

    <div class="more-info-tab">
      <div class="location"></div>
      <div class="company"></div>
      <div class="twitter"></div>
      <div class="email"></div>
    </div>

    <div class="technologies">
      <p class="technology"></p>
    </div>
  </section>

  <section class="right-tabs-container">
    <form method="get">
      <input type="text" name="" id="" />
    </form>

    <div class="repositories">
      <div class="repository"></div>
    </div>
  </section>
</template>
