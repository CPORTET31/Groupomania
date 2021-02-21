<template>
    <div class="card mb-4 w-75 mx-auto">
        <div class="card-header d-flex justify-content-between">
          <div>
              Username : <em class="text-secondary">{{user.username}}</em> / 
              Email : <em class="text-secondary">{{user.email}}</em> / 
              Crée le : <em class="text-secondary">{{user.createdAt.split(' ')[0]}} à {{user.createdAt.split(' ')[1]}}</em>
              <span v-if="user.isAdmin==true" > - <i>ADMIN</i></span>
            </div>
            <button
                class="deleteUser btn btn-danger"
                data-toggle="modal"
                data-target="#modalDeleteUser"
                type="button"
                @click="emitInfoUser();"
            >Supprimer</button>
        </div>
    </div>
</template>

<script>

export default {
  name: "User",
  components: {},
  data() {
    return {};
  },
  computed: {

  },
  props: {
    user: {
      type: Object,
      required: true
    }
  },
  methods: {
    emitInfoUser() {
      this.$emit("infosUser", { user: this.user });
    }
  }
};
</script>

<style>
.deleteUser {
  width: auto;
}
</style>