<template>
  <div class="header">
    <v-toolbar dark height="44">
      <v-spacer></v-spacer>
      <v-toolbar-title class="yellow--text text--darken-1 mx-auto">
        <div class="logo d-inline-block mr-2"></div>
        <span class="text yellow--text text--darken-1">Chicken Music</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn icon to="/user">
        <v-icon color="primary" :small="true">far fa-user</v-icon>
      </v-btn>
      <v-tabs
        ripple
        centered
        grow
        color="grey darken-4"
        slot="extension"
        slider-color="primary"
        v-model="active">
        <v-tab ripple active-class="yellow--text text--darken-1" class="grey--text text--lighten-1" v-for="(tab, index) in tabItems" :key="index" :to="tab.link">
          {{ tab.title }}
        </v-tab>
      </v-tabs>
    </v-toolbar>
  </div>
</template>

<script>
export default {
  name:'m-header',
  data() {
    return {
      active: null
    }
  },
  created() {
    this.tabItems = [
      {title: '推荐', link:'/recommend'},
      {title: '歌手', link:'/singer'},
      {title: '排行', link:'/rank'},
      {title: '搜索', link:'/search'},
    ]
  }
}
</script>

<style lang="scss" scoped>
@import '../../base/scss/variable.scss';
@import '../../base/scss/mixin.scss';

  .header {
    position: relative;
    z-index: 10;
    font-size: 0;
    .logo, .text {
      vertical-align: middle;
    }
    .logo {
      width: 28px;
      height: 30px;
      background-size: 28px 30px;
      @include bg-image('./images/logo');
    }
    .text {
      font-size: $size-lg-s;
    }
  }
</style>
