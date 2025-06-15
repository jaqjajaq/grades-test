<script setup>
import { ref, computed } from "vue"

const calculatedGeneralAverage = 95.238723

const subjectData = ref({
    name: 'General Chemistry II',
    teacher: 'Ms. Nova',
    categories: [
        /*
        {
          id: 'cat-1',
          name: 'Written Works',
          weight: 30,
          subcategories: [
            {
              id: 'sub-1a',
              name: 'Quizzes',
              weight: 40, // weight within Written Works
              assessments: [
                { id: 'asm-1', name: 'Quiz 1', score: 15, total: 20 },
                { id: 'asm-2', name: 'Quiz 2', score: 18, total: 20 }
              ]
            },
            {
              id: 'sub-1b',
              name: 'Essays',
              weight: 60, // weight within Written Works
              assessments: []
            }
          ]
        },
        // ... other categories
        */
    ]
})

const newCategory = ref({ name: "", weight: null })
const newSubcategory = ref({ parentCategoryId: "", name: "", weight: null })
const newAssessment = ref({ parentCategoryId: "", parentSubcategoryId: "", name: "", score: null, total: null })

const filteredSubcategories = computed(() => {
    const selectedCategoryId = newAssessment.value.parentCategoryId

    if (!selectedCategoryId) {
        return [] // Return empty array if no category is selected yet
    }

    // Find the selected category
    const targetCategory = subjectData.value.categories.find(category => category.id === selectedCategoryId)

    // Return its subcategories, or empty array if category not found (shouldn't happen with proper dropdown)
    return targetCategory ? targetCategory.subcategories : []
})

function addCategory() {
    const category = {
        id: Date.now(),
        name: newCategory.value.name,
        weight: newCategory.value.weight,
        subcategories: []
    }

    subjectData.value.categories.push(category)

    // Reset newCategory form fields after successful push
    newCategory.value = { name: "", weight: null }
}

function addSubcategory() {
    const subcategory = {
        parentCategoryId: newSubcategory.value.parentCategoryId,
        id: Date.now(),
        name: newSubcategory.value.name,
        weight: newSubcategory.value.weight,
        assessments: []
    }

    const targetCategory = subjectData.value.categories.find(category => category.id === newSubcategory.value.parentCategoryId)

    // 2. If found, push the new subcategory
    if (targetCategory) {
        targetCategory.subcategories.push(subcategory)

        // Reset newSubcategory form fields after successful push
        newSubcategory.value = { parentCategoryId: "", name: "", weight: null }
    } else {
        // Handle case where parent category is not found (e.g., alert user)
        console.error("Parent category not found!")
    }
}

function addAssessment() {
    const assessment = {
        parentCategoryId: newAssessment.value.parentCategoryId,
        parentSubcategoryId: newAssessment.value.parentSubcategoryId,
        id: Date.now(),
        name: newAssessment.value.name,
        score: newAssessment.value.score,
        total: newAssessment.value.total
    }

    const targetCategory = subjectData.value.categories.find(category => category.id === newAssessment.value.parentCategoryId)

    if (targetCategory) {
        const targetSubcategory = targetCategory.subcategories.find(subcategory => subcategory.id === newAssessment.value.parentSubcategoryId)

        if (targetSubcategory) {
            targetSubcategory.assessments.push(assessment)

            // reset form
            newAssessment.value = { parentCategoryId: "", parentSubcategoryId: "", name: "", score: null, total: null }
        } else {
            console.error("Parent subcategory not found!")
        }
    } else {
        // Handle case where parent category is not found (e.g., alert user)
        console.error("Parent category not found!")
    }
}

function saveData() {
    localStorage.setItem("subjectData", JSON.stringify(subjectData.value))
}

function loadData() {
    const loadedData = localStorage.getItem("subjectData")

    if (loadedData) { subjectData.value = JSON.parse(loadedData) }
}

function resetData() {
    subjectData.value.categories = []

    localStorage.clear()
}

</script>

<template>
    <div class="subject-overview">
        <h2>{{ subjectData.name }}</h2>
        <p class="teacher-name">Teacher: {{ subjectData.teacher }}</p>

        <div class="average-section">
            <h3>Subject General Average: </h3>
            <p class="average-value">{{ calculatedGeneralAverage.toFixed(2) }}%</p>
        </div>

        <section class="grading-input-forms">
            <p>Input your data through these forms.</p>

            <section class="create-category-form">
                <h3>Create New Category</h3>
                <form @submit.prevent="addCategory">
                    <label for="category-name">Name:</label>
                    <input type="text" id="category-name" v-model="newCategory.name">

                    <label for="category-weight">Weight (%):</label>
                    <input type="number" id="category-weight" v-model.number="newCategory.weight">

                    <button type="submit">Add Category</button>
                </form>
            </section>

            <section class="create-subcategory-form">
                <h3>Create New Subcategory</h3>
                <form @submit.prevent="addSubcategory">
                    <label for="parent-category-select">Select Parent Category:</label>
                    <select id="parent-category-select" v-model="newSubcategory.parentCategoryId">
                        <option value="" disabled selected>-- Choose Category --</option>
                        <option v-for="category in subjectData.categories" :key="category.id" :value="category.id">
                            {{ category.name }}
                        </option>
                    </select>

                    <label for="subcategory-name">Name:</label>
                    <input type="text" id="subcategory-name" v-model="newSubcategory.name">

                    <label for="subcategory-weight">Weight (% within Category):</label>
                    <input type="number" id="subcategory-weight" v-model.number="newSubcategory.weight">

                    <button type="submit">Add Subcategory</button>
                </form>
            </section>

            <section class="create-assessment-form">
                <h3>Create New Assessment</h3>
                <form @submit.prevent="addAssessment">
                    <label for="assessment-category-select">Select Parent Category:</label>
                    <select id="assessment-category-select" v-model="newAssessment.parentCategoryId">
                        <option value="" disabled selected>-- Choose Category --</option>
                        <option v-for="category in subjectData.categories" :key="category.id" :value="category.id">
                            {{ category.name }}
                        </option>
                    </select>

                    <label for="assessment-subcategory-select">Select Parent Subcategory:</label>
                    <select id="assessment-subcategory-select" v-model="newAssessment.parentSubcategoryId">
                        <option value="" disabled selected>-- Choose Subcategory --</option>
                        <option v-for="subcategory in filteredSubcategories" :key="subcategory.id" :value="subcategory.id">
                            {{ subcategory.name }}
                        </option>
                    </select>

                    <label for="assessment-name">Name:</label>
                    <input type="text" id="assessment-name" v-model="newAssessment.name">

                    <label for="assessment-score">Score:</label>
                    <input type="number" id="assessment-score" v-model.number="newAssessment.score">

                    <label for="assessment-total">Total Points:</label>
                    <input type="number" id="assessment-total" v-model.number="newAssessment.total">

                    <button type="submit">Add Assessment</button>
                </form>
            </section>
        </section>

        <section class="grades-display">
            <p>A list/table displaying your defined grading structure and assessments will go here.</p>

            <pre>{{ JSON.stringify(subjectData, null, 2) }}</pre>
        </section>

        <section class="storage-options">
            <button type="button" @click="saveData()">Save Data</button>
            <button type="button" @click="loadData()">Load Data</button>
            <button type="button" @click="resetData()">Reset Data</button>
        </section>
    </div>
</template>

<style scoped>
* {
    font-family: 'Red Hat Text' !important;
}
</style>