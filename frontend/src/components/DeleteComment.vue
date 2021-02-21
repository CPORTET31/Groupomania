<template>
  <div
    class="modal fade"
    id="modalDeleteComment"
    tabindex="-1"
    role="dialog"
    aria-labelledby="ModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog">
      <!--Une suppression est demandée-->
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="ModalLabel">Supprimer ce commentaire</h5>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <p>Etes vous sûr de vouloir supprimer ce commentaire ?</p>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-dismiss="modal">Annuler</button>
          <button type="button" class="btn btn-danger" @click="deleteComment">Supprimer</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import axios from "axios";

export default {
  name: "modalBoxDeleteComment",
  data() {
    return {    };
  },
  computed: {
    ...mapState(["user"])
  },
  props: {
    comment: {
      type: Object,
      default() {}
    }
  },
  methods: {
    reload() {
      window.location.reload();
    },
    deleteComment() {
      axios
        .delete("http://localhost:3000/api/comment/delete", {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token")
          },
          data: {
            commentId: this.comment.id,
            userIdOrder: this.user.userId,
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