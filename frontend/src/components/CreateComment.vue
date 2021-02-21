<template>
  <div
    class="modal fade"
    id="modalAddComment"
    tabindex="-1"
    role="dialog"
    aria-labelledby="ModalLabelComment"
    aria-hidden="true"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="ModalLabelComment">Ajouter un commentaire</h5>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <form enctype="multipart/form-data" action="/create" method="post">
            <div class="input-group mb-3">
              <label for="inputNewTextComment">Ajouter votre texte</label>
              <br />
              <textarea v-model="contentComment.content" class="input-text" id="inputNewTextComment" type="text"></textarea>
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-dismiss="modal">Annuler</button>
          <button type="button" class="btn btn-primary" @click.prevent="createComment">Sauvegarder</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import axios from "axios";

export default {
  name: "modalBoxComment",
  data() {
    return {  
      contentComment: {
        content: null,
      },
      render: true
    };
  },
  computed: {
    ...mapState(["user"])
  },
  props: {
    post: {
      type: Object,
      default() {}
    }
  },
  methods: {
    reload() {
      window.location.reload();
    },
    createComment() {
      const fd = new FormData();
      fd.append("content", this.contentComment.content);
      console.log(this.contentComment);
      axios
        .post("http://localhost:3000/api/comment/create", fd, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token")
          },
          data: {
            postId: this.post.id,
            content: this.contentComment.content,
          }
        })
        .then(() => {
          this.reload();
        })
        .catch(error => console.log(error));
    },
  }
};
</script>

<style>
</style>