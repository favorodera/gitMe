<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import axios from 'axios'
import Skeleton from './Skeleton.vue'
import { RouterLink, useRouter  } from 'vue-router'

const API_URL = ref('https://api.github.com/users')
const USER = ref(null)
const BIO_DATA = ref(null)
const REPOS_DATA = ref([])
const PAGE_SIZE = ref(8)
const CURRENT_PAGE = ref(1)
const NUMBER_OF_REPO_SKELETON = ref(0)
const IS_REPO_POPUP_VISIBLE = ref(false)
const SELECTED_REPOSITORY_POPUP_DETAILS = ref(null)
const FETCH_STATE = ref('Awaiting Input...')
const router = useRouter()

const PAGINATED_REPOS = computed(() => {
  const startIndex = (CURRENT_PAGE.value - 1) * PAGE_SIZE.value
  const endIndex = Math.min(startIndex + PAGE_SIZE.value, REPOS_DATA.value.length)
  return REPOS_DATA.value.slice(startIndex, endIndex)
})

const TOTAL_PAGES = computed(() => Math.ceil(REPOS_DATA.value.length / PAGE_SIZE.value))

onMounted(() => {
  window.addEventListener('resize', resize)
  resize()
})

onUnmounted(() => {
  window.removeEventListener('resize', resize)
})

const fetchGithubInformation = async () => {
  if (FETCH_STATE.value === 'Error Fetching Info, Retrying...') {
    FETCH_STATE.value = 'Error Fetching Info, Retrying...'
  } else {
    FETCH_STATE.value = 'Fetching Info...'
  }
  try {
    REPOS_DATA.value = []

    let currentPage = 1
    let hasMorePages = true

    while (hasMorePages) {
      const requests = [
        axios.get(`${API_URL.value}/${USER.value}/repos?per_page=100&sort='updated'&page=${currentPage}`),
        axios.get(`${API_URL.value}/${USER.value}`)
      ]

      const [reposResponse, bioResponse] = await Promise.all(requests)

      if (reposResponse.data.length === 0) {
        hasMorePages = false
      } else {
        REPOS_DATA.value = REPOS_DATA.value.concat(reposResponse.data)
        currentPage++
      }

      BIO_DATA.value = bioResponse.data
    }

    FETCH_STATE.value = 'Information Fetched ✨'
  } catch (error) {
    FETCH_STATE.value = 'Error Fetching Info, Retrying...'
    fetchGithubInformation()
  }
}

const resize = () => {
  const width = window.innerWidth
  if (width >= 320 && width <= 859) {
    PAGE_SIZE.value = 3
    NUMBER_OF_REPO_SKELETON.value = 3
  } else if (width >= 860 && width <= 1099) {
    PAGE_SIZE.value = 6
    NUMBER_OF_REPO_SKELETON.value = 6
  } else if (width >= 1100 && width <= 1339) {
    PAGE_SIZE.value = 9
    NUMBER_OF_REPO_SKELETON.value = 9
  } else {
    PAGE_SIZE.value = 10
    NUMBER_OF_REPO_SKELETON.value = 10
  }
  CURRENT_PAGE.value = 1
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

const showRepoPopup = (repositoryDetails) => {
  SELECTED_REPOSITORY_POPUP_DETAILS.value = repositoryDetails
  IS_REPO_POPUP_VISIBLE.value = true
}

const closeRepoPopup = () => {
  IS_REPO_POPUP_VISIBLE.value = false
  SELECTED_REPOSITORY_POPUP_DETAILS.value = null
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

  <p style="text-align: center">{{ FETCH_STATE }}</p>

  <div class="main-tabs-container" v-if="FETCH_STATE === 'Information Fetched ✨'">
    <section class="left-tabs-container" :aria-hidden="IS_REPO_POPUP_VISIBLE">
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
            :href="`https://twitter.com/${BIO_DATA.twitter_username}`"
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
    </section>

    <section class="right-tabs-container" :aria-hidden="IS_REPO_POPUP_VISIBLE">
      <div class="repositories">
        <RouterLink
          :to="{
            name: 'repository-details',
            params: { repositoryName: repository.name, repositoryOwner: BIO_DATA.login }
          }"
          class="repository"
          v-for="repository in PAGINATED_REPOS"
          :key="repository.id"
          @click="showRepoPopup(repository)"
        >
          <div class="repository-name-and-folder-icon-container">
            <img src="../../icons/folder.svg" alt="" />
            <p>{{ repository.name }}</p>
          </div>

          <p class="repository-description">
            {{ repository.description }}
          </p>
        </RouterLink>

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

    <div v-if="IS_REPO_POPUP_VISIBLE" class="repository-popup-container">
      <div class="repository-more-info-container">
        <div class="stars" id="repository-more-info-item">
          <div class="repository-more-info-item-tittle-and-icon-container">
            <img src="../../icons/star.svg" alt="" />
            <p>Stars:</p>
          </div>
          <p>{{ SELECTED_REPOSITORY_POPUP_DETAILS.stargazers_count }}</p>
        </div>
        <div class="forks" id="repository-more-info-item">
          <div class="repository-more-info-item-tittle-and-icon-container">
            <img src="../../icons/fork.svg" alt="" />
            <p>Forks:</p>
          </div>

          <p>{{ SELECTED_REPOSITORY_POPUP_DETAILS.forks_count }}</p>
        </div>

        <div class="repository-main-language" id="repository-more-info-item">
          <div class="repository-more-info-item-tittle-and-icon-container">
            <img src="../../icons/code.svg" alt="" />
            <p>Language:</p>
          </div>

          <p>{{ SELECTED_REPOSITORY_POPUP_DETAILS.language }}</p>
        </div>

        <div class="repository-watchers" id="repository-more-info-item">
          <div class="repository-more-info-item-tittle-and-icon-container">
            <img src="../../icons/eye.svg" alt="" />
            <p>Watchers:</p>
          </div>

          <p>{{ SELECTED_REPOSITORY_POPUP_DETAILS.watchers }}</p>
        </div>
      </div>

      <div style="width: 100%; display: flex; flex-direction: column; gap: 0.5rem">
        <a
          :href="SELECTED_REPOSITORY_POPUP_DETAILS.html_url"
          target="_blank"
          rel="noopener noreferrer"
          class="view-repository-link"
        >
          <p>View Repository</p>
        </a>
        <a
          :href="SELECTED_REPOSITORY_POPUP_DETAILS.homepage"
          target="_blank"
          rel="noopener noreferrer"
          class="view-live-link"
          v-show="SELECTED_REPOSITORY_POPUP_DETAILS.homepage !== null"
        >
          <p>View Live Site</p>
        </a>
      </div>
      <button @click="closeRepoPopup" class="repository-popup-close-button">
        <img src="../../icons/close.svg" alt="" />
      </button>
    </div>
  </div>

  <!-- SKELETONS -->
  <div class="main-tabs-container" v-else>
    <section class="left-tabs-container">
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

      <div class="more-info-tab" style="flex: 1 0 auto">
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
    </section>

    <section class="right-tabs-container">
      <div class="repositories">
        <div
          class="repository"
          style="height: 15rem; width: 100%"
          v-for="repositorySkeleton in NUMBER_OF_REPO_SKELETON"
          :key="repositorySkeleton"
        >
          <div class="repository-name-and-folder-icon-container" style="height: 20%; width: 100%">
            <Skeleton :skeletonHeight="100" :skeletonWidth="20" :skeletonRadius="0.5" />
            <Skeleton :skeletonHeight="100" :skeletonWidth="80" :skeletonRadius="0.5" />
          </div>

          <Skeleton :skeletonHeight="100" :skeletonWidth="100" :skeletonRadius="0.5" />

        </div>
      </div>
    </section>
  </div>
</template>
