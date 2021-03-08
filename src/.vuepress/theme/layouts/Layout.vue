<template>
  <div
    class="theme-container"
    :class="pageClasses"
    @touchstart="onTouchStart"
    @touchend="onTouchEnd"
  >
    <Navbar
      v-if="shouldShowNavbar"
      @toggle-sidebar="toggleSidebar"
      ref="nav"
    />

    <div
      class="sidebar-mask"
      @click="toggleSidebar(false)"
    />

    <Sidebar
      :items="sidebarItems"
      @toggle-sidebar="toggleSidebar"
    >
      <template #top>
        <slot name="sidebar-top"/>
      </template>
      <template #bottom>
        <slot name="sidebar-bottom"/>
      </template>
    </Sidebar>

    <Home v-if="$page.frontmatter.home"/>

    <Page
      v-else
      :sidebar-items="sidebarItems"
    >

      <template #top>
        <slot name="page-top"/>
        <div v-if="showBook" style=" text-align:center; margin-top: 100px">
          <img src="./book.png" class="book" title="点击去购买" @click="buy('btn')"/>
        </div>
      </template>
      <template #bottom>
        <div class='copyright'> 版权所有，禁止私自转发、克隆网站。</div>
        <div style='text-align: center' class='f-links'>
          <a @click='buy("link")'
             title='点击购买'
             target='_blank'> 购买实体书
          </a> |
          <a href='https://github.com/flutterchina'>
            Flutter中国开源项目
          </a> |
          <a href='/join_us.html'>
            和作者做同事
          </a>

        </div>

      </template>
    </Page>
  </div>
</template>

<script>
  import Home from '@theme/components/Home.vue'
  import Navbar from '@theme/components/Navbar.vue'
  import Page from '@theme/components/Page.vue'
  import Sidebar from '@theme/components/Sidebar.vue'
  import {resolveSidebarItems} from '@vuepress/theme-default/util'

  let _hmt;

  function initPVSDK() {
    _hmt = _hmt || [];
    let hm = document.createElement("script");
    hm.src = "https://hm.baidu.com/hm.js?170231fea4f81697eb046edc1a91fe5b";
    let s = document.getElementsByTagName("script")[0];
    hm.id = "bd"
    s.parentNode.insertBefore(hm, s);
  }

  const hideBookRoutes = [
    '/join_us.html'
  ]

  export default {
    name: 'Layout',

    components: {
      Home,
      Page,
      Sidebar,
      Navbar
    },

    data() {
      return {
        isSidebarOpen: false,
        showBook: false,
      }
    },

    computed: {
      shouldShowNavbar() {
        const {themeConfig} = this.$site
        const {frontmatter} = this.$page
        if (
          frontmatter.navbar === false
          || themeConfig.navbar === false) {
          return false
        }
        return (
          this.$title
          || themeConfig.logo
          || themeConfig.repo
          || themeConfig.nav
          || this.$themeLocaleConfig.nav
        )
      },

      shouldShowSidebar() {
        const {frontmatter} = this.$page
        return (
          !frontmatter.home
          && frontmatter.sidebar !== false
          && this.sidebarItems.length
        )
      },

      sidebarItems() {
        return resolveSidebarItems(
          this.$page,
          this.$page.regularPath,
          this.$site,
          this.$localePath
        )
      },

      pageClasses() {
        const userPageClass = this.$page.frontmatter.pageClass
        return [
          {
            'no-navbar': !this.shouldShowNavbar,
            'sidebar-open': this.isSidebarOpen,
            'no-sidebar': !this.shouldShowSidebar
          },
          userPageClass
        ]
      }
    },

    mounted() {
      initPVSDK()
      this.lastPathname = ''
      this.$router.afterEach(() => {
        if (hideBookRoutes.indexOf(location.pathname) === -1) {
          this.showBook = true;
        }
        if (this.lastPathname !== location.pathname) {
          console.log(location.pathname);
          _hmt.push(['_trackPageview', this.lastPathname = location.pathname])

          //百度统计
          var e = /([http|https]:\/\/[a-zA-Z0-9\_\.]+\.baidu\.com)/gi, r = window.location.href,
            t = document.referrer;
          if (!e.test(r)) {
            var o = "https://sp0.baidu.com/9_Q4simg2RQJ8t7jm9iCKT-xh_/s.gif";
            t ? (o += "?r=" + encodeURIComponent(document.referrer), r && (o += "&l=" + r)) : r && (o += "?l=" + r);
            var i = new Image;
            i.src = o
          }
        }
        this.isSidebarOpen = false
      })
      const {themeConfig} = this.$site
      let logo = themeConfig.logo;

      let checkIfShowLogo = () => {
        if (window.innerWidth < 720 && themeConfig.log !== "") {
          themeConfig.logo = ""
          this.$refs.nav.$forceUpdate()
        } else if (window.innerWidth >= 720 && themeConfig.logo === "") {
          themeConfig.logo = logo
          console.log("xx")
          this.$refs.nav.$forceUpdate()
        }
      }

      checkIfShowLogo()

      window.addEventListener('resize', checkIfShowLogo)

    },

    methods: {

      buy(p) {
        _hmt.push(['_trackEvent', 'buy', 'click', p]);
        open('https://item.jd.com/12816296.html', '_blank');
      },

      toggleSidebar(to) {
        this.isSidebarOpen = typeof to === 'boolean' ? to : !this.isSidebarOpen
        this.$emit('toggle-sidebar', this.isSidebarOpen)
      },

      // side swipe
      onTouchStart(e) {
        this.touchStart = {
          x: e.changedTouches[0].clientX,
          y: e.changedTouches[0].clientY
        }
      },

      onTouchEnd(e) {
        const dx = e.changedTouches[0].clientX - this.touchStart.x
        const dy = e.changedTouches[0].clientY - this.touchStart.y
        if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 40) {
          if (dx > 0 && this.touchStart.x <= 80) {
            this.toggleSidebar(true)
          } else {
            this.toggleSidebar(false)
          }
        }
      }
    }
  }
</script>

<style>
  .copyright {
    text-align: center;
    margin: 50px 16px 8px 16px;
    color: grey;
    font-size: .9em;
  }

  .f-links a {
    font-weight: normal;
    text-decoration: underline;
    font-size: .9em;
    color: dodgerblue !important;
  }

  .f-links a:hover {
    opacity: .8 !important;
  }

  .book {
    transition: 200ms box-shadow;
    max-width: 180px;
    box-shadow: 2px 2px 5px #aaa;
    cursor: pointer;
  }

  .book:hover {
    box-shadow: 5px 5px 8px #888;
  }

</style>
