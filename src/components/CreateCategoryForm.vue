<script setup>
import { ref } from 'vue';

const newCategory = ref({ name: '', weight: null });

const emit = defineEmits(["add-category"])

function handleAddCategory() {
    emit('add-category', {
        id: Date.now(),
        name: newCategory.value.name,
        weight: newCategory.value.weight,
        subcategories: []
    });

    // Reset form fields
    newCategory.value = { name: '', weight: null };
}
</script>

<template>
    <section class="create-category-form">
        <h3>Create New Category</h3>
        <form @submit.prevent="handleAddCategory">
            <label for="category-name">Name:</label>
            <input type="text" id="category-name" v-model="newCategory.name" required>

            <label for="category-weight">Weight (%):</label>
            <input type="number" id="category-weight" v-model.number="newCategory.weight" required>

            <button type="submit">Add Category</button>
        </form>
    </section>
</template>

<style scoped>
form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}
</style>