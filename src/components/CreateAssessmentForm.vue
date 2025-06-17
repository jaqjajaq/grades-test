<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
    categories: {
        type: Array,
        required: true
    }
})

const newAssessment = ref({ parentCategoryId: "", parentSubcategoryId: "", name: "", score: null, total: null })

// A variable that lists the available subcategories to choose from in the form depending on the chosen category
const filteredSubcategories = computed(() => {
    const selectedCategoryId = newAssessment.value.parentCategoryId

    if (!selectedCategoryId) {
        return [] // Return empty array if no category is selected yet
    }

    // Find the selected category
    const targetCategory = props.categories.find(category => category.id === selectedCategoryId)

    // Return its subcategories, or empty array if category not found (shouldn't happen with proper dropdown)
    return targetCategory ? targetCategory.subcategories : []
})

const emit = defineEmits(["add-assessment"])

function handleAddAssessment() {
    emit('add-assessment', {
        parentCategoryId: newAssessment.value.parentCategoryId,
        parentSubcategoryId: newAssessment.value.parentSubcategoryId,
        id: Date.now(),
        name: newAssessment.value.name,
        score: newAssessment.value.score,
        total: newAssessment.value.total,
    })

    // Reset form fields
    newAssessment.value = { parentCategoryId: "", parentSubcategoryId: "", name: "", score: null, total: null }
}
</script>

<template>
    <section class="create-assessment-form">
        <h3>Create New Assessment</h3>
        <form @submit.prevent="handleAddAssessment">
            <label for="assessment-category-select">Select Parent Category:</label>
            <select id="assessment-category-select" v-model="newAssessment.parentCategoryId" required>
                <option value="" disabled selected>-- Choose Category --</option>
                <option v-for="category in props.categories" :key="category.id" :value="category.id">
                    {{ category.name }}
                </option>
            </select>

            <label for="assessment-subcategory-select">Select Parent Subcategory:</label>
            <select id="assessment-subcategory-select" v-model="newAssessment.parentSubcategoryId" required>
                <option value="" disabled selected>-- Choose Subcategory --</option>
                <option v-for="subcategory in filteredSubcategories" :key="subcategory.id" :value="subcategory.id">
                    {{ subcategory.name }}
                </option>
            </select>

            <label for="assessment-name">Name:</label>
            <input type="text" id="assessment-name" v-model="newAssessment.name" required>

            <label for="assessment-score">Score:</label>
            <input type="number" id="assessment-score" v-model.number="newAssessment.score" required>

            <label for="assessment-total">Total Points:</label>
            <input type="number" id="assessment-total" v-model.number="newAssessment.total" required>

            <button type="submit">Add Assessment</button>
        </form>
    </section>
</template>

<style scoped></style>