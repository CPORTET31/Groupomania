import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    authenticated: localStorage.getItem('token')!=null,
    user: {
      username: 'Nc',
      userId: 'Nc',
      email: 'Nc',
      token: null,
      isAdmin: true
    },
    editOption: ""
  },
  mutations: {
    setAuthentication(state, status) {
      state.authenticated = status;
    },
    saveUserInfos(state, [username, userId, email, isAdmin]) {
        state.user.username = username,
          state.user.userId = userId,
          state.user.email = email,
          state.user.token = localStorage.getItem('token'),
          state.user.isAdmin = isAdmin
    },
    editStyle(state, value) {
      state.editOption = value
    }
  },
  actions: {
    getUserInfos(context) {
      axios
        .get("http://localhost:3000/api/user/me", {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token")
          }
        })
        .then(response => {
          console.log('réponse API',response);
          context.commit('saveUserInfos',[response.data.username, response.data.id, response.data.email, response.data.isAdmin])
        })
        .catch(error => {
          localStorage.clear();
          this.$store.commit("setAuthentication", false);
          this.$router.replace({ name: "Signup" });
          console.log('Erreur auth', error);
        });
    },
    changeEditStyle(context, value){
      context.commit('editStyle',value)
    }
  },
  modules: {
  }
});
