<script setup>
import { ref } from 'vue';

const props = defineProps({
    categories: {
        type: Array,
        required: true
    }
})

const newSubcategory = ref({ parentCategoryId: "", name: "", weight: null })

const emit = defineEmits(["add-subcategory"])

function handleAddSubcategory() {
    emit('add-subcategory', {
        parentCategoryId: newSubcategory.value.parentCategoryId,
        id: Date.now(),
        name: newSubcategory.value.name,
        weight: newSubcategory.value.weight,
        assessments: []
    })

    // Reset form fields
    newSubcategory.value = { parentCategoryId: "", name: "", weight: null }
}
</script>

<template>
    <section class="create-subcategory-form">
        <h3>Create New Subcategory</h3>
        <form @submit.prevent="handleAddSubcategory">
            <label for="parent-category-select">Select Parent Category:</label>
            <select id="parent-category-select" v-model="newSubcategory.parentCategoryId" required>
                <option value="" disabled selected>-- Choose Category --</option>
                <option v-for="category in props.categories" :key="category.id" :value="category.id">
                    {{ category.name }}
                </option>
            </select>

            <label for="subcategory-name">Name:</label>
            <input type="text" id="subcategory-name" v-model="newSubcategory.name" required>

            <label for="subcategory-weight">Weight (% within Category):</label>
            <input type="number" id="subcategory-weight" v-model.number="newSubcategory.weight" required>

            <button type="submit">Add Subcategory</button>
        </form>
    </section>
</template>

<style scoped></style>