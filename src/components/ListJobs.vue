<script setup>
import ModifyTaksPanel from './ModifyTaksPanel.vue'
import { ref, reactive } from 'vue'


const listJobs = reactive([
  { id: 1, title: 'Task 1', purchased: true, priority: 'high' },
  { id: 2, title: 'Task 2', purchased: false, priority: 'medium' },
  { id: 3, title: 'Task 3', purchased: false, priority: 'low' },
])

const newItem = ref({ id: listJobs.length + 1, title: '', purchased: false, priority: 'medium' })

const seeModifyPanel = ref(false)

const togglePurchased = (item) => {
  item.purchased = !item.purchased
}

const addItem = () => {
  if (newItem.value.title.trim() !== '') {
    listJobs.push({ ...newItem.value, id: listJobs.length + 1 })
    newItem.value.title = ''
  }
}

const openModifyPanel = () => {
  seeModifyPanel.value = true
}

const closeModifyPanel = () => {
  seeModifyPanel.value = false
}

const eliminateItem = (item) => {
  const index = listJobs.indexOf(item)
  if (index > -1) {
    listJobs.splice(index, 1)
  }
}

</script>

<template>
  <h2>Create Task</h2>
  <form id="job-list" @submit.prevent="addItem">
    <input type="text" v-model="newItem.title" placeholder="Add a new task" />
    <select v-model="newItem.priority">
      <option value="high" class="colorPriority-high">High</option>
      <option value="medium" class="colorPriority-medium">Medium</option>
      <option value="low" class="colorPriority-low">Low</option>
    </select>
    <button class="btn btn-primary" type="submit">Add</button>
  </form>
  <br />
  <div v-if="listJobs.length === 0">
    <p>No tasks available.</p>
  </div>
  <div v-else>
    
    <h2>Modify Tasks</h2>

    <form id="job-modify" @submit.prevent="openModifyPanel">
      <button class="btn btn-primary" type="submit">Modify Tasks</button>
    </form>

    <br />
    <h2>Task List</h2>

    <div class="job-list-container">
      <table>
        <tbody>
          <tr v-for="item in listJobs" 
              :key="item.id" 
              class="static-class" 
              >
            <td @click="togglePurchased(item)"
              :class="{strikeout: item.purchased, 
                      'colorPriority-high': item.priority === 'high', 
                      'colorPriority-medium': item.priority === 'medium', 
                      'colorPriority-low': item.priority === 'low'}">
                      {{ item.title }}</td>
            <td>
              <button class="btn btn-cancel" @click.stop="eliminateItem(item)">x</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="seeModifyPanel" class="overlay">
      <div class="popup">
        <ModifyTaksPanel :listJobs="listJobs" />
        <br />
        <button class="btn btn-cancel" @click="closeModifyPanel">Close</button>
      </div>
    </div>
  </div>
</template>
