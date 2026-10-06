<script setup>
import { ref, reactive } from 'vue'

const listJobs = reactive([
  { id: 1, title: 'Task 1', purchased: true},
  { id: 2, title: 'Task 2', purchased: false},
  { id: 3, title: 'Task 3', purchased: false},
])

const newItem = ref({ id: listJobs.length + 1, title: '', purchased: false })

const togglePurchased = (item) => {
  item.purchased = !item.purchased
}

const addItem = () => {
  if (newItem.value.title.trim() !== '') {
    listJobs.push({ ...newItem.value, id: listJobs.length + 1 })
    newItem.value.title = ''
  }
}
</script>

<template>

  <form id="job-list" @submit.prevent="addItem">
    <input type="text" v-model="newItem.title" placeholder="Add a new task" />
    <button class="btn btn-primary" type="submit">Add</button>
  </form>

  <ul>
    <li v-for="item in listJobs" 
        :key="item.index" 
        class="static-class" 
        @click="togglePurchased(item)"
        :class="{strikeout: item.purchased }">
      {{ item.title }}
    </li>
  </ul>
</template>
