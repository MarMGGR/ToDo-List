<script setup>
import ModifyTaksPanel from './ModifyTaksPanel.vue'
import { ref, reactive, onMounted } from 'vue'

const listJobs = reactive([])
const isLoading = ref(true)
const loadError = ref('')

const newItem = ref({ id: listJobs.length + 1, title: '', purchased: false, priority: 'medium' })

const seeModifyPanel = ref(false)

onMounted(async () => {
  try {
    const response = await fetch('/api/tasks')
    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`)
    }

    const tasks = await response.json()
    if (!Array.isArray(tasks)) {
      throw new Error('The tasks response is not a list')
    }
    listJobs.splice(0, listJobs.length, ...tasks)
  } catch (error) {
    loadError.value = error instanceof Error ? error.message : 'Unknown error'
  } finally {
    isLoading.value = false
  }
})

/**
onMounted(() => {
  const storedList = localStorage.getItem('listJobs')
  if (storedList) {
    const parsedList = JSON.parse(storedList)
    listJobs.splice(0, listJobs.length, ...parsedList)
  }
})

watch(
  listJobs,
  (newList) => {
    localStorage.setItem('listJobs', JSON.stringify(newList))
  },
  { deep: true }
)**/

const togglePurchased = (item) => {
  item.purchased = !item.purchased
  modificarItem(item, item.title, item.priority)
}

const openModifyPanel = () => {
  seeModifyPanel.value = true
}

const closeModifyPanel = () => {
  seeModifyPanel.value = false

  for (const item of listJobs) {
    modificarItem(item, item.title, item.priority)
  }
}

const addItem = () => {
  if (newItem.value.title.trim() !== '') {
    newItem.value.id = listJobs.length + 1
    listJobs.push({ ...newItem.value})
    fetch('/api/tasks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newItem.value)
    })
    newItem.value.title = ''
  }
}

const eliminateItem = (item) => {
  const index = listJobs.indexOf(item)
  if (index > -1) {
    listJobs.splice(index, 1)
    fetch(`/api/tasks/${item.id}`, {
      method: 'DELETE'
    })
  }
}

const modificarItem = (item, newTitle, newPriority) => {
  const index = listJobs.indexOf(item)
  if (index > -1) {
    listJobs[index].title = newTitle
    listJobs[index].priority = newPriority
    fetch(`/api/tasks/${item.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(listJobs[index])
    })
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
  <p v-if="loadError" role="alert">Could not load tasks: {{ loadError }}</p>
  <p v-if="isLoading">Loading tasks...</p>
  <div v-else-if="!loadError && listJobs.length === 0">
    <p>No tasks available.</p>
  </div>
  <div v-else-if="!loadError">
    
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
