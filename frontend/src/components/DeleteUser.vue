<template>
  <div
    class="modal fade"
    id="modalDeleteUser"
    tabindex="-1"
    role="dialog"
    aria-labelledby="ModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog">
      <!--Une suppression est demandée-->
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="ModalLabel">Supprimer cet utilisateur</h5>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <p>Etes vous sûr de vouloir supprimer cet utilisateur ?</p>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-dismiss="modal">Annuler</button>
          <button type="button" class="btn btn-danger" @click="deleteUser">Supprimer</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "modalBoxDeleteUser",
  data() {
    return {    };
  },
  computed: {

  },
  props: {
    user: {
      type: Object,
      default() {}
    }
  },
  methods: {
    reload() {
      window.location.reload();
    },
    deleteUser() {
      axios
        .delete("http://localhost:3000/api/user/deleteFromId", {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token")
          },
          data: {
            userId: this.user.id,
          }
        })
        .then(() => {
          this.reload();
        })
        .catch(error => console.log(error));
    }
  }
};
</script>

<style>
</style>