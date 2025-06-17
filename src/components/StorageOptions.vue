<script setup>
const emit = defineEmits(["save-data", "load-data", "reset-data"])

function saveData () {
    emit('save-data')
}

function loadData () {
    emit('load-data')
}

function resetData () {
    emit('reset-data')
}
</script>

<template>
    <section class="storage-options">
        <button type="button" @click="saveData()">Save Data</button>
        <button type="button" @click="loadData()">Load Data</button>
        <button type="button" @click="resetData()">Reset Data</button>
    </section>
</template>

<style scoped></style>