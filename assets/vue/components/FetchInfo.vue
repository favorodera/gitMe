<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import axios from 'axios'
import Skeleton from './Skeleton.vue'

const API_URL = ref('https://api.github.com/users')
const USER = ref(null)
const BIO_DATA = ref(null)
const REPOS_DATA = ref([])
const PAGE_SIZE = ref(8)
const CURRENT_PAGE = ref(1)

const handleResize = () => {
  const width = window.innerWidth
  if (width >= 320 && width <= 859) {
    PAGE_SIZE.value = 3
  } else if (width >= 860 && width <= 1099) {
    PAGE_SIZE.value = 6
  } else if (width >= 1100 && width <= 1339) {
    PAGE_SIZE.value = 9
  } else {
    PAGE_SIZE.value = 10
  }
  CURRENT_PAGE.value = 1
}

onMounted(() => {
  window.addEventListener('resize', handleResize)
  handleResize()
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})

const PAGINATED_REPOS = computed(() => {
  const startIndex = (CURRENT_PAGE.value - 1) * PAGE_SIZE.value
  const endIndex = Math.min(startIndex + PAGE_SIZE.value, REPOS_DATA.value.length)
  return REPOS_DATA.value.slice(startIndex, endIndex)
})
const TOTAL_PAGES = computed(() => Math.ceil(REPOS_DATA.value.length / PAGE_SIZE.value))
const FETCH_STATE = ref('Input A Valid Github Username')

const fetchGithubInformation = async () => {
  FETCH_STATE.value = 'Fetching Github Info'
  try {
    const requests = [
      axios.get(`${API_URL.value}/${USER.value}`),
      axios.get(`${API_URL.value}/${USER.value}/repos`)
    ]

    const responses = await Promise.all(requests)
    BIO_DATA.value = responses[0].data
    REPOS_DATA.value = responses[1].data
    FETCH_STATE.value = 'Github Info Fetched'
    console.log(BIO_DATA, REPOS_DATA)
  } catch (error) {
    console.log(error)
  }
}

const goToPreviousPage = () => {
  if (CURRENT_PAGE.value > 1) {
    CURRENT_PAGE.value--
  }
}

const goToNextPage = () => {
  if (CURRENT_PAGE.value < TOTAL_PAGES.value) {
    CURRENT_PAGE.value++
  }
}
</script>

<template>
  <form method="get" @submit.prevent="fetchGithubInformation">
    <input
      type="text"
      name="username-input"
      id="username-input"
      v-model="USER"
      placeholder="Input Github Username"
    />
  </form>
  <div class="main-tabs-container">
    <section class="left-tabs-container" v-if="FETCH_STATE === 'Github Info Fetched'">
      <div class="profile-header-tab">
        <div class="profile-image-container"><img :src="BIO_DATA.avatar_url" alt="" /></div>
        <p class="name">{{ BIO_DATA.name }}</p>
        <p class="bio">{{ BIO_DATA.bio }}</p>
        <div class="follows">
          <p class="followers">Followers: {{ BIO_DATA.followers }}</p>
          <p class="following">Following: {{ BIO_DATA.following }}</p>
        </div>
      </div>

      <div class="more-info-tab">
        <div class="location" id="more-info-item" v-show="BIO_DATA.location !== null">
          <img src="../../icons/location.svg" alt="" />
          <p>{{ BIO_DATA.location }}</p>
        </div>
        <div class="company" id="more-info-item" v-show="BIO_DATA.company !== null">
          <img src="../../icons/briefcase.svg" alt="" />
          <p>{{ BIO_DATA.company }}</p>
        </div>
        <div class="twitter" id="more-info-item" v-show="BIO_DATA.twitter_username !== null">
          <img src="../../icons/twitter.svg" alt="" />
          <a
            :href="`twitter.com/${BIO_DATA.twitter_username}`"
            target="_blank"
            rel="noopener noreferrer"
            >{{ BIO_DATA.twitter_username }}</a
          >
        </div>
        <div class="email" id="more-info-item" v-show="BIO_DATA.email !== null">
          <img src="../../icons/email.svg" alt="" />
          <a :href="`mailto:${BIO_DATA.email}`" target="_blank" rel="noopener noreferrer">{{
            BIO_DATA.email
          }}</a>
        </div>
        <div class="github" id="more-info-item">
          <img src="../../icons/github.svg" alt="" />
          <a :href="`${BIO_DATA.html_url}`" target="_blank" rel="noopener noreferrer">{{
            BIO_DATA.html_url
          }}</a>
        </div>
        <div class="website" id="more-info-item" v-show="BIO_DATA.blog !== ''">
          <img src="../../icons/website.svg" alt="" />
          <a :href="`${BIO_DATA.blog}`" target="_blank" rel="noopener noreferrer">{{
            BIO_DATA.blog
          }}</a>
        </div>
      </div>

      <!-- <div class="technologies-tab">
        <img
          :src="`https://github-readme-stats.vercel.app/api/top-langs?username=${BIO_DATA.login}&theme=material-palenight&hide_title=false&langs_count=5&hide_border=true&custom_title=Technologies`"
          alt=""
        />
      </div> -->
    </section>

    <section v-else class="left-tabs-container">
      <div class="profile-header-tab">
        <Skeleton
          :skeletonHeight="45"
          :skeletonWidth="55"
          :skeletonRadius="100"
          :skeletonMaxWidth="8"
        />
        <Skeleton :skeletonHeight="10" :skeletonWidth="80" :skeletonRadius="0.5" />
        <Skeleton :skeletonHeight="20" :skeletonWidth="80" :skeletonRadius="0.5" />
        <div class="follows" style="height: 2rem">
          <Skeleton :skeletonHeight="50" :skeletonWidth="40" :skeletonRadius="0.5" />
          <Skeleton :skeletonHeight="50" :skeletonWidth="40" :skeletonRadius="0.5" />
        </div>
      </div>

      <div class="more-info-tab">
        <div class="location" id="more-info-item" style="height: 1.5rem">
          <Skeleton :skeletonHeight="100" :skeletonWidth="10" :skeletonRadius="0.5" />
          <Skeleton :skeletonHeight="100" :skeletonWidth="80" :skeletonRadius="8" />
        </div>
        <div class="company" id="more-info-item" style="height: 1.5rem">
          <Skeleton :skeletonHeight="100" :skeletonWidth="10" :skeletonRadius="0.5" />
          <Skeleton :skeletonHeight="100" :skeletonWidth="80" :skeletonRadius="8" />
        </div>
        <div class="twitter" id="more-info-item" style="height: 1.5rem">
          <Skeleton :skeletonHeight="100" :skeletonWidth="10" :skeletonRadius="0.5" />
          <Skeleton :skeletonHeight="100" :skeletonWidth="80" :skeletonRadius="8" />
        </div>
        <div class="email" id="more-info-item" style="height: 1.5rem">
          <Skeleton :skeletonHeight="100" :skeletonWidth="10" :skeletonRadius="8" />
          <Skeleton :skeletonHeight="100" :skeletonWidth="80" :skeletonRadius="8" />
        </div>
        <div class="github" id="more-info-item" style="height: 1.5rem">
          <Skeleton :skeletonHeight="100" :skeletonWidth="10" :skeletonRadius="8" />
          <Skeleton :skeletonHeight="100" :skeletonWidth="80" :skeletonRadius="8" />
        </div>
        <div class="website" id="more-info-item" style="height: 1.5rem">
          <Skeleton :skeletonHeight="100" :skeletonWidth="10" :skeletonRadius="8" />
          <Skeleton :skeletonHeight="100" :skeletonWidth="80" :skeletonRadius="8" />
        </div>
      </div>

      <div class="technologies-tab" style="height: 15rem">
        <Skeleton :skeletonHeight="100" :skeletonWidth="100" :skeletonRadius="1.25" />
      </div>
    </section>

    <section class="right-tabs-container">
      <div class="repositories">
        <a
          :href="repository.git_url"
          target="_blank"
          rel="noopener noreferrer"
          class="repository"
          v-for="repository in PAGINATED_REPOS"
          :key="repository.id"
        >
          <div class="repository-name-and-folder-icon-container">
            <img src="../../icons/folder.svg" alt="" />
            <p>{{ repository.name }}</p>
          </div>

          <p class="repository-description">
            {{ repository.description }}
          </p>

          <div class="repository-more-info-container">
            <div class="stars" id="repository-more-info-item">
              <img src="../../icons/star.svg" alt="" />
              <p>{{ repository.stargazers_count }}</p>
            </div>
            <div class="forks" id="repository-more-info-item">
              <img src="../../icons/fork.svg" alt="" />
              <p>{{ repository.forks_count }}</p>
            </div>

            <div class="repository-main-language" id="repository-more-info-item">
              <img src="../../icons/code.svg" alt="" />
              <p>{{ repository.language }}</p>
            </div>
          </div>
        </a>

        <div class="pagination-buttons-container" v-if="TOTAL_PAGES > 1">
          <button
            @click="goToPreviousPage"
            :disabled="CURRENT_PAGE === 1"
            class="previous-page-button"
          >
            Previous Page
          </button>
          <span style="text-align: center">Page {{ CURRENT_PAGE }} of {{ TOTAL_PAGES }}</span>
          <button
            @click="goToNextPage"
            :disabled="CURRENT_PAGE === TOTAL_PAGES"
            class="next-page-button"
          >
            Next Page
          </button>
        </div>
      </div>
    </section>
  </div>
</template>
