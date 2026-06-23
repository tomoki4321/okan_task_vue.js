import { createApp } from 'vue'
import { createPinia } from 'pinia'
import "vuetify/styles";
import "@mdi/font/css/materialdesignicons.css";
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import { aliases, mdi } from "vuetify/iconsets/mdi";


const vuetify = createVuetify({
  theme: {
    defaultTheme: localStorage.getItem("theme") || "light",
    themes: {
      light: {
        dark: false,
        colors: {
          background: "#fff8ec",
          primary: "#f4a627",
          "okan-orange": "#e8632c",
          "okan-yellow": "#f4b942",
          "okan-cream": "#f4a627",
        },
      },
      dark: {
        dark: true,
        colors: {
          background: "#121212",
          primary: "#f4a627",
          "okan-orange": "#e8632c",
          "okan-yellow": "#f4b942",
          "okan-cream": "#f4a627",
        },
      },
    },
  },
  icons: {
    defaultSet: "mdi",
    aliases,
    sets: {
      mdi,
    },
  },
  components,
  directives,
});

import App from './App.vue'
import router from './router'

import './assets/main.css'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(vuetify);

app.mount('#app')
