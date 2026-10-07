<script setup>
const props = defineProps({
  modifyJobs: {
    type: Array,
    required: true,
  },
})

</script>


<template>
  <h2>Modify Tasks</h2>

  <div class="modify-task-table-container">
    <table class="modify-task-table">
      <thead>
        <tr>
          <th>Title</th>
          <th>Priority</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in modifyJobs" :key="item.id">
          <td><input type="text" v-model="item.title" /></td>
          <td>
            <select v-model="item.priority">
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </td>
        </tr>
      </tbody>
    </table>
  </div>

</template>