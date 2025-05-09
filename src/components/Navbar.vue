<script setup>
import { RouterLink, useRoute } from 'vue-router';

const isActiveLink = (routePath) => {
    const route = useRoute()
    return route.path === routePath

}
</script>

<template>
    <nav class="navbar p-4" role="navigation" aria-label="main navigation">
        <div class="navbar-brand">
            <span class="is-size-4 has-text-weight-semibold has-text-primary">Task Table</span>
        </div>

        <div class="navbar-menu">
            <div class="navbar-end">
                <div class="navbar-item">
                    <div class="buttons">
                        <RouterLink to="/" :class="[isActiveLink('/') ? 'button is-primary': 'button is-light']">
                            Listes de commandes</RouterLink>

                        <RouterLink to="/create"
                            :class="[isActiveLink('/create') ? 'button is-primary' : 'button is-light']">Creation de
                            commandes</RouterLink>

                        <RouterLink to="/client"
                            :class="[isActiveLink('/client') ? 'button is-primary' : 'button is-light']">Client Table
                        </RouterLink>

                        <RouterLink to="/types"
                            :class="[isActiveLink('/types') ? 'button is-primary' : 'button is-light']">Client Types
                        </RouterLink>

                        <RouterLink to="/naming"
                            :class="[isActiveLink('/naming') ? 'button is-primary' : 'button is-light']">Naming Series
                        </RouterLink>
                    </div>
                </div>
            </div>
        </div>

    </nav>
</template>