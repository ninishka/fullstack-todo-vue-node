# Vue 2 Frontend Learning Guide

## Current Project Status
This is a todo application frontend built with Vue 3 using Options API.

## Technologies Used
- **Vue 3** (currently) - JavaScript framework
- **Options API** - Component structure
- **Single File Components** - .vue files
- **CSS/SCSS** - Component styling
- **Fetch API** - HTTP requests

## Current Features
-  Vue Options API (data, methods, mounted)
-  Component communication (props, events)
-  Form handling and validation
-  File upload with preview
-  Modern CSS styling
-  Responsive design
-  HTTP API integration

## Vue Skills Assessment

###  What You Already Know (Transferable to Vue 2)
- Vue Options API syntax
- Component communication patterns
- Template syntax (with minor differences)
- Lifecycle hooks
- Event handling
- Form data binding
- Component styling

###  Critical Vue 2 Differences You Must Learn

#### **1. Vue Instance Creation**
```javascript
// Vue 3 (what you're using now)
import { createApp } from 'vue'
createApp(App).mount('#app')

// Vue 2 (what you need to learn)
import Vue from 'vue'
new Vue({
  render: h => h(App),
}).$mount('#app')
```

#### **2. Template Structure**
```vue
<!-- Vue 3 (current) - Multiple root elements allowed -->
<template>
  <div>Content 1</div>
  <div>Content 2</div>
</template>

<!-- Vue 2 (required) - Single root element mandatory -->
<template>
  <div>
    <div>Content 1</div>
    <div>Content 2</div>
  </div>
</template>
```

#### **3. Reactivity Differences**
```javascript
// Vue 2 - Adding reactive properties
Vue.set(this.object, 'newProperty', value)
// or
this.$set(this.object, 'newProperty', value)

// Vue 2 - Array reactivity
this.$set(this.items, indexOfItem, newValue)
```

## Essential Vue 2 Technologies for Junior Developer

### **1. Vue Router (Critical)**
```javascript
// Router setup in Vue 2
import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  { path: '/', component: Home },
  { path: '/todos', component: TodoList },
  { path: '/login', component: Login }
]

const router = new VueRouter({
  mode: 'history',
  routes
})

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
```

### **2. Vuex (State Management - Essential)**
```javascript
// Store setup in Vue 2
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
  state: {
    todos: [],
    user: null
  },
  mutations: {
    SET_TODOS(state, todos) {
      state.todos = todos
    },
    ADD_TODO(state, todo) {
      state.todos.push(todo)
    }
  },
  actions: {
    async fetchTodos({ commit }) {
      const response = await fetch('/api/todos')
      const todos = await response.json()
      commit('SET_TODOS', todos)
    }
  },
  getters: {
    completedTodos: state => state.todos.filter(t => t.completed)
  }
})
```

### **3. Component Communication Patterns**
```javascript
// Event Bus (common in Vue 2)
// main.js
Vue.prototype.$eventBus = new Vue()

// Component A
this.$eventBus.$emit('data-updated', data)

// Component B
this.$eventBus.$on('data-updated', (data) => {
  // Handle data
})
```

## Learning Plan for Vue 2 Transition

### **Week 1: Vue 2 Core Differences**

#### **Day 1: Setup & Basic Differences**
```bash
# Install Vue CLI for Vue 2
npm install -g @vue/cli
vue create vue2-todo-app
# Select Vue 2 when prompted
```
- Recreate your todo app in Vue 2
- Practice single root element templates
- Learn Vue 2 instance creation

#### **Day 2-3: Vue Router**
```bash
cd vue2-todo-app
vue add router
```
- Create multiple pages/routes
- Implement navigation
- Learn route guards
- Practice programmatic navigation

#### **Day 4-5: Vuex State Management**
```bash
vue add vuex
```
- Move todo state to Vuex store
- Implement actions for API calls
- Use getters for computed data
- Practice mutations for state changes

#### **Day 6: Advanced Patterns**
- Mixins (more common in Vue 2)
- Filters (exist in Vue 2, removed in Vue 3)
- Custom directives
- Event bus pattern

#### **Day 7: Vue 2 Ecosystem**
- Vue DevTools
- Testing with Vue Test Utils
- Build configuration
- Deployment basics

## Essential Vue 2 Patterns

### **1. Vuex Integration in Components**
```javascript
// Using Vuex in components
export default {
  computed: {
    todos() {
      return this.$store.state.todos
    },
    completedTodos() {
      return this.$store.getters.completedTodos
    }
  },
  methods: {
    addTodo(text) {
      this.$store.dispatch('addTodo', text)
    }
  }
}
```

### **2. Route Guards**
```javascript
// Authentication guard
router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth && !store.state.user) {
    next('/login')
  } else {
    next()
  }
})
```

### **3. Mixins (Common in Vue 2)**
```javascript
// mixins/validation.js
export const validationMixin = {
  methods: {
    validateRequired(value) {
      return value && value.trim().length > 0
    },
    validateEmail(email) {
      const re = /\S+@\S+\.\S+/
      return re.test(email)
    }
  }
}

// In component
import { validationMixin } from '@/mixins/validation'

export default {
  mixins: [validationMixin],
  // Now you can use validateRequired() and validateEmail()
}
```

### **4. Filters (Vue 2 Only)**
```javascript
// Global filters
Vue.filter('capitalize', function(value) {
  if (!value) return ''
  value = value.toString()
  return value.charAt(0).toUpperCase() + value.slice(1)
})

// In template
{{ message | capitalize }}
```

## Common Vue 2 Interview Topics

1. **Vue Instance Lifecycle**
   - beforeCreate, created, beforeMount, mounted
   - beforeUpdate, updated, beforeDestroy, destroyed

2. **Component Communication**
   - Props down, events up
   - Event bus for sibling communication
   - Vuex for global state

3. **Reactivity System**
   - Vue.set() for adding reactive properties
   - Array mutation methods
   - Watch vs computed

4. **Vue Router**
   - Route definition and navigation
   - Route guards and meta fields
   - Lazy loading components

5. **Vuex Patterns**
   - State, mutations, actions, getters
   - Module organization
   - Async actions

## Next Steps

### **Immediate Actions (This Week)**
1. Install Vue CLI and create Vue 2 project
2. Recreate your todo app in Vue 2
3. Add Vue Router with multiple pages
4. Implement Vuex for state management
5. Add authentication flow

### **Practice Projects**
1. **Todo App with Authentication** - Login, user-specific todos
2. **Blog Frontend** - Posts list, detail pages, categories
3. **E-commerce Frontend** - Product catalog, cart, checkout

## Study Resources
- [Vue 2 Official Documentation](https://v2.vuejs.org/)
- [Vue Router Documentation](https://v3.router.vuejs.org/)
- [Vuex Documentation](https://v3.vuex.vuejs.org/)
- [Vue 2 vs Vue 3 Migration Guide](https://v3-migration.vuejs.org/)

## Common Vue 2 Gotchas

### **Template Limitations**
```vue
<!-- ❌ This doesn't work in Vue 2 -->
<template>
  <div>First element</div>
  <div>Second element</div>
</template>

<!-- ✅ This works in Vue 2 -->
<template>
  <div>
    <div>First element</div>
    <div>Second element</div>
  </div>
</template>
```

### **Reactivity Issues**
```javascript
// ❌ Won't be reactive in Vue 2
this.object.newProperty = 'value'

// ✅ Properly reactive in Vue 2
this.$set(this.object, 'newProperty', 'value')
```

## Red Flags to Avoid
- Using Composition API syntax (Vue 3 only)
- Multiple root elements in templates
- Forgetting to register Vue plugins (Router, Vuex)
- Not handling reactivity edge cases
- Using ES6+ features not supported in target browsers

---
*Your Options API knowledge is excellent! Focus on Vue Router and Vuex - these are the biggest gaps for your junior role.* 