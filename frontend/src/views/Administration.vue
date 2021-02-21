<template>
  <div id="administration" class="administration">

    <h2>Liste des utilisateurs : </h2><br/>
    <User v-for="user in allUsers" v-bind:key="user.id" :user="user" @infosUser="setInfos" />
    <modalBoxDeleteUser :user="user" />

  </div>
</template>

<script>
import axios from "axios";
import User from "../components/User";
import modalBoxDeleteUser from "../components/DeleteUser";

export default {
  name: "Administration",
  components: {
    User,
    modalBoxDeleteUser,
  },
  data() {
    return {
      user: {
        id: "",
        email: "",
        username: "",
        isAdmin: "",
        createdAt: ""
      },
      allUsers: []
    };
  },
  methods: {
    setInfos(payload) {
      this.user = payload.user;
    }
  },
  mounted() {
    this.$store.dispatch("getUserInfos"),
    axios
      .get("http://localhost:3000/api/user/listUsers", {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token")
        }
      })
      .then(response => {
        console.log("users", response.data);
        this.allUsers = response.data;
      })
      .catch(error => {
        console.log(error);
      });
  }
};
</script>

<style lang="scss">
.administration {
  margin-top: 100px;
}
.administration h2 {
  text-align: center;
  font-weight: bold;
}
</style>