<script setup>
import Form from '@/components/Form.vue';
import clientCommands from '@/config/commands.json';
import { ref } from 'vue';
import config from '@/config/config';

const commands = ref(clientCommands)
const tableColumns = ref(config.table.columns)
</script>

<template>
    <Form :returnCommands="commands" :columns="tableColumns" />
</template>