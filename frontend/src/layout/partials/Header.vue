<template>
  <b-navbar id="template-header" class="navbar default-layout-navbar p-0 fixed-top" toggleable="lg">
    <div class="horizontal-menu">
      <nav class="navbar top-navbar col-lg-12 col-12 p-0">
        <div class="container">
          <div class="navbar-menu-wrapper d-flex align-items-center ml-auto ml-lg-0">
            <b-navbar-nav class="navbar-nav-right ml-auto">
              <b-nav-item-dropdown right class="nav-profile">
                <template slot="button-content">
                  <span
                    class="nav-link dropdown-toggle"
                    id="profileDropdown"
                    href="javascript:void(0);"
                    data-toggle="dropdown"
                    aria-expanded="false"
                  >
                    <div class="nav-profile-img">
                      <img src="https://via.placeholder.com/36X36" alt="image" />
                    </div>
                  </span>
                </template>
                <b-dropdown-item class="preview-item">
                  <i class="ti-settings text-primary"></i> Settings
                </b-dropdown-item>
                <b-dropdown-item class="preview-item">
                  <i class="ti-power-off text-primary"></i> Logout
                </b-dropdown-item>
              </b-nav-item-dropdown>
            </b-navbar-nav>
          </div>
        </div>
      </nav>
      <nav class="bottom-navbar">
        <div class="container">
          <ul class="nav page-navigation">
            <li class="nav-item">
              <router-link class="nav-link" to="/">
                <i class="ti-home menu-icon menu-icon"></i>
                <span class="menu-title">Transacciones</span>
              </router-link>
            </li>
            <li class="nav-item">
              <router-link class="nav-link" to="/reportes">
                <i class="ti-clipboard menu-icon"></i>
                <span class="menu-title">Reportes</span>
              </router-link>
            </li>
          </ul>
        </div>
      </nav>
    </div>
  </b-navbar>
</template>

<script>
export default {
  name: "app-header",
  mounted() {
    var navItems = document.querySelectorAll(
      ".horizontal-menu .page-navigation >.nav-item"
    );
    document
      .querySelectorAll(".horizontal-menu .page-navigation >.nav-item")
      .forEach(function(el) {
        el.addEventListener("click", function() {
          for (var i = 0; i < navItems.length; i++) {
            if (navItems[i] == el) {
              el.classList.toggle("show-submenu");
            } else {
              navItems[i].classList.remove("show-submenu");
            }
          }
        });
      });
  },
  methods: {
    toggleMobileSidebar: () => {
      document
        .querySelector(".bottom-navbar")
        .classList.toggle("header-toggled");
    },
    togglesettingsPannel: () => {
      document.querySelector("#right-sidebar").classList.toggle("open");
    },
    subIsActive(input) {
      const paths = Array.isArray(input) ? input : [input];
      return paths.some(path => {
        return this.$route.path.indexOf(path) === 0; // current path starts with this path string
      });
    },
    handleSCroll() {
      let header = document.querySelector("body");
      if (window.scrollY > 70) {
        header.classList.add("fixed-on-scroll");
      } else {
        header.classList.remove("fixed-on-scroll");
      }
    }
  },
  created() {
    window.addEventListener("scroll", this.handleSCroll);
  },
  destroyed() {
    window.removeEventListener("scroll", this.handleSCroll);
  },
  watch: {
    $route() {
      document
        .querySelector(".bottom-navbar")
        .classList.remove("header-toggled");
    }
  }
};
</script>

<style scoped></style>
