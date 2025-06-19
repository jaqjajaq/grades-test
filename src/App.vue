<script setup>
import { ref, computed } from "vue"

import CreateCategoryForm from "./components/CreateCategoryForm.vue"
import CreateSubcategoryForm from "./components/CreateSubcategoryForm.vue"
import CreateAssessmentForm from "./components/CreateAssessmentForm.vue"
import GradesDisplay from "./components/GradesDisplay.vue"
import StorageOptions from "./components/StorageOptions.vue"

import { calculateSubjectGrade } from "./utils/gradesCalculator"

const calculatedSubjectGrade = computed(() => {
  return calculateSubjectGrade(subjectData.value.categories);
});

// the root structure of the data of a single subject
const subjectData = ref({
    name: 'General Chemistry II',
    teacher: 'Ms. Nova',
    categories: []
})

function handleAddCategory(newCategory) {
    subjectData.value.categories.push(newCategory)
}

function handleAddSubcategory(newSubcategory) {
    const targetCategory = subjectData.value.categories.find(category => category.id === newSubcategory.parentCategoryId)

    if (targetCategory) {
        targetCategory.subcategories.push(newSubcategory)
    } else {
        alert("Parent category not found!")
    }
}

function handleAddAssessment(newAssessment) {
    const targetCategory = subjectData.value.categories.find(category => category.id === newAssessment.parentCategoryId)

    if (targetCategory) {
        const targetSubcategory = targetCategory.subcategories.find(subcategory => subcategory.id === newAssessment.parentSubcategoryId)

        if (targetSubcategory) {
            targetSubcategory.assessments.push(newAssessment)
        } else {
            console.error("Parent subcategory not found!")
        }
    } else {
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
            <p class="average-value">{{ (calculatedSubjectGrade * 100).toFixed(4) }}</p>
        </div>

        <section class="grading-input-forms">
            <p>Input your data through these forms.</p>

            <CreateCategoryForm @add-category="handleAddCategory" />
            <CreateSubcategoryForm :categories="subjectData.categories" @add-subcategory="handleAddSubcategory" />
            <CreateAssessmentForm :categories="subjectData.categories" @add-assessment="handleAddAssessment" />

        </section>

        <GradesDisplay :subject-data=subjectData />

        <StorageOptions @save-data="saveData" @load-data="loadData" @reset-data="resetData" />
    </div>
</template>

<style scoped>
* {
    font-family: 'Red Hat Text' !important;
}
</style>