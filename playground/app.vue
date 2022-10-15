<template>
  <div>
    {{ error }}
  </div>
</template>

<script setup>

import { useOryError, useOrySession } from '../src/runtime/composables/useOryState'
import useOry from '../src/runtime/composables/useOry'
// import { useOryValidateSession, useOrySession, useOryError } from '#app'

const error = useOryError()
const session = useOrySession()
const client = useOry()

</script>
