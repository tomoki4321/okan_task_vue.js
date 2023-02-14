<script setup lang="ts">
import {ref,reactive} from 'vue';


const progressCounter=ref(0);

</script>


<template>
  <div>
    <div>
      <label for="name">タスク名</label>
      <input type="text" id="name">
    </div>
    <div>
      <label for="content">内容</label>
      <textarea name="content" id="content" cols="30" rows="5"></textarea>
    </div>
    <div>
      <label for="limit">期日</label>
      <input type="date" id="limit">
    </div>
    <div>
      <label for="priority">優先度</label>
      <select name="priority" id="priority">
        <option value="1">高</option>
        <option value="2">中</option>
        <option value="3">低</option>
      </select>
    </div>
    <div>
      <label for="status">ステータス</label>
      <select name="status" id="status">
        <option value="1">未着手</option>
        <option value="2">未完了</option>
        <option value="3">完了</option>
      </select>
    </div>
    <div>
      <label for="progress">進行度</label>
      <progress id="progress" max="100" v-bind:value="progressCounter"></progress>
      <input type="text" v-model="progressCounter">%
    </div>
    <button>タスク登録</button>
  </div>
</template>