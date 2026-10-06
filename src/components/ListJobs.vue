<script setup>
import { ref, reactive } from 'vue'

const listJobs = reactive([
  { id: 1, title: 'Task 1', purchased: true, priority: 'high' },
  { id: 2, title: 'Task 2', purchased: false, priority: 'medium' },
  { id: 3, title: 'Task 3', purchased: false, priority: 'low' },
])

const newItem = ref({ id: listJobs.length + 1, title: '', purchased: false, priority: 'medium' })

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
    <select v-model="newItem.priority">
      <option value="high" class="colorPriority-high">High</option>
      <option value="medium" class="colorPriority-medium">Medium</option>
      <option value="low" class="colorPriority-low">Low</option>
    </select>
    <button class="btn btn-primary" type="submit">Add</button>
  </form>

 <!--<button class="btn btn-cancel" @click.stop="listJobs.splice(listJobs.indexOf(item), 1)">x</button> -->

  <ul>
    <li v-for="item in listJobs" 
        :key="item.id" 
        class="static-class" 
        @click="togglePurchased(item)"
        :class="{strikeout: item.purchased, 'colorPriority-high': item.priority === 'high', 'colorPriority-medium': item.priority === 'medium', 'colorPriority-low': item.priority === 'low'}">
      {{ item.title }}
    </li>
  </ul>
</template>
