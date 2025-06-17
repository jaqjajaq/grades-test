<script setup>
const props = defineProps({
    subjectData: {
        type: Object,
        required: true
    }
})

</script>

<template>
    <section class="grades-display">
        <p>A list/table displaying your defined grading structure and assessments will go here.</p>

        <pre>{{ JSON.stringify(props.subjectData, null, 2) }}</pre>
    </section>
</template>

<style scoped>

</style>