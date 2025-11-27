<template>
  <div class="team-card">
    csaaaaaaaaaaaaaaaaa
    <div class="card-content">
      <h3>{{ node.name }}</h3>
      <p class="title">{{ node.title }}</p>
      <p class="reports">Reports To: {{ node.parent?.name || 'Top Level' }}</p>
      <div class="actions">
        <Button icon="pi pi-pencil" class="p-button-rounded p-button-text" @click="$emit('edit', node)" />
        <Button icon="pi pi-trash" class="p-button-rounded p-button-text p-button-danger" @click="$emit('remove', node)" />
      </div>
    </div>
    <div v-if="node.children.length" class="subordinates">
      <h4>Subordinates</h4>
      <div class="sub-list">
        <OrgCard v-for="child in node.children" :key="child.id" :node="child" @edit="$emit('edit', $event)" @remove="$emit('remove', $event)" />
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps(['node']);
defineEmits(['edit', 'remove']);
</script>

<style scoped>
.team-card {
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 1.25rem;
  background: #fff;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.03);
}
.card-content h3 {
  margin: 0;
  font-size: 1.3rem;
  color: #111827;
}
.card-content .title {
  color: #6b7280;
  font-style: italic;
}
.card-content .reports {
  margin: 0.5rem 0 1rem;
  color: #4b5563;
}
.actions {
  display: flex;
  gap: 0.5rem;
}
.subordinates {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #e5e7eb;
}
.sub-list {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}
</style>
