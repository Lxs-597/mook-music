<template>
  <div id="app">
    <v-app dark>
      <m-header></m-header>
      <keep-alive>
        <router-view/>
      </keep-alive>
      <player></player>
    </v-app>
  </div>
</template>

<script>
import MHeader from 'components/m-header/MHeader'
import Player from 'pages/player/Player'

export default {
  name: 'App',
  components: {
    MHeader,
    Player
  }
}
</script>
