<template>
  <div class="card mb-4 w-75 mx-auto">
    <div class="card-header d-flex justify-content-between">
      <div>Posté par <em class="text-secondary">{{post.User.username}}</em> le <em class="text-secondary">{{post.createdAt.split(' ')[0]}}</em> à <em class="text-secondary">{{post.createdAt.split(' ')[1]}}</em></div>
      <div class="dropdown" v-if="user.isAdmin==true || user.username == post.User.username">
        <svg
          class="bi bi-three-dots dropdown-toggle"
          id="dropdownMenuPost"
          data-toggle="dropdown"
          aria-haspopup="true"
          aria-expanded="false"
          width="1em"
          height="1em"
          viewBox="0 0 16 16"
          fill="currentColor"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill-rule="evenodd"
            d="M3 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z"
          />
        </svg>
        <div class="dropdown-menu" aria-labelledby="dropdownMenuPost">
          <button
            class="dropdown-item modifPost"
            data-toggle="modal"
            data-target="#modalEditPost"
            type="button"
            @click="emitInfoPost();changeEditStyle('modify');"
          >Modifier</button>
          <button
            class="dropdown-item deletePost"
            data-toggle="modal"
            data-target="#modalEditPost"
            type="button"
            @click="emitInfoPost();changeEditStyle('delete');"
          >Supprimer</button>
        </div>
      </div>
    </div>
    <div class="card-body">
      <div class="card-img-top w-75 mx-auto" v-if="post.attachement">
        <img :src="post.attachement" alt="..." class="w-100" />
      </div>
      <div class="card-text" v-if="post.content!=='null'">
        <p class="mb-0">{{post.content}}</p>
      </div>
    </div>
    <hr/>
    <span class="comment" v-for="comment in post.Comments" v-bind:key="comment.id" :comment="comment">
      <div>
        Commenté par <em class="text-secondary">{{comment.User.username}}</em> le <em class="text-secondary">{{comment.createdAt.split(' ')[0]}}</em> à <em class="text-secondary">{{comment.createdAt.split(' ')[1]}}</em> :
        {{comment.content}} 
      </div>
      <button v-if="user.isAdmin==true || user.username == comment.User.username"
        class="btn btn-danger"
        data-toggle="modal"
        data-target="#modalDeleteComment"
        type="button"
        @click="emitInfoComment(comment);"
        >X</button>
        <hr/>
    </span>
    <button
      class="addComment btn btn-success"
      data-toggle="modal"
      data-target="#modalAddComment"
      type="button"
      @click="emitInfoPost();"
      >Ajouter commentaire</button>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  name: "Post",
  components: {  },
  data() {
    return {    };
  },
  computed: {
    ...mapState(["user", "editOption"])
  },
  props: {
    post: {
      type: Object,
      required: true
    },
    /*comment: {
      type: Object,
      required: true
    }*/
  },
  methods: {
    emitInfoPost() {
      this.$emit("infosPost", { 
        post: this.post 
      });
    },
    emitInfoComment(comment) {
      this.$emit("infosComment", { 
        comment: comment
      });
    },
    changeEditStyle(value) {
      this.$store.dispatch("changeEditStyle", value);
    },
  }
};
</script>

<style>
.comment {
  display: flex;
  border-bottom: black dashed 1px;
  align-items: center;
}
.comment div {
  width: -moz-available;
}
.comment button {
  margin: 5px;
}
.addComment {
  margin-top: 10px;
}
</style>