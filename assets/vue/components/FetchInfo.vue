<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const API_URL = ref('https://api.github.com/users')
const USER = ref(null)
const BIO_DATA = ref(null)
const REPOS_DATA = ref(null)

const fetchGithubInformation = async () => {
  try {
    const requests = [
      axios.get(`${API_URL.value}/${USER.value}`),
      axios.get(`${API_URL.value}/${USER.value}/repos`)
    ]

    const responses = await Promise.all(requests)
    BIO_DATA.value = responses[0].data
    REPOS_DATA.value = responses[1].data

    console.log(BIO_DATA, REPOS_DATA)
  } catch (error) {
    console.log(error)
  }
}
</script>

<template>
  <section class="left-tabs-container">
    <div class="profile-header-tab">
      <div class="profile-image-container"><img src="../../icons/profilePicture.jpg" alt="" /></div>
      <p class="name">Favour Emeka</p>
      <p class="bio">Developer</p>
      <div class="follows">
        <p class="followers">Followers: 100</p>
        <p class="following">Following: 100</p>
      </div>
    </div>

    <div class="more-info-tab">
      <div class="location"></div>
      <div class="company"></div>
      <div class="twitter"></div>
      <div class="email"></div>
      <div class="github"></div>
      <div class="website"></div>
    </div>

    <div class="technologies-tab">
      <p class="technologies-tab-header">Technologies</p>
      <div class="technologies">
        <p class="technology">HTML</p>
        <p class="technology">HTML</p>
        <p class="technology">HTML</p>
        <p class="technology">HTML</p>
        <p class="technology">HTML</p>
        <p class="technology">HTML</p>
        <p class="technology">HTML</p>
        <p class="technology">HTML</p>
        <p class="technology">HTML</p>
        <p class="technology">HTML</p>
        <p class="technology">HTML</p>
      </div>
    </div>
  </section>

  <!-- <section class="right-tabs-container">
    <form method="get" @submit.prevent="fetchGithubInformation">
      <input type="text" name="" id="" v-model="USER" />
    </form>

    <div class="repositories">
      <div class="repository"></div>
    </div>
  </section> -->
</template>
