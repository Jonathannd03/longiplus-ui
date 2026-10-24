import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { createRouter, createMemoryHistory } from 'vue-router'
import { createPinia } from 'pinia'
import AppSidebar from '../src/components/AppSidebar.vue'

const router = createRouter({
  history: createMemoryHistory(),
  routes: [
    { path: '/', component: { template: '<div />' } },
    { path: '/app/dashboard', component: { template: '<div />' } },
    { path: '/app/students', component: { template: '<div />' } },
    { path: '/app/classes', component: { template: '<div />' } },
    { path: '/app/attendance', component: { template: '<div />' } },
    { path: '/app/grades', component: { template: '<div />' } },
    { path: '/app/messages', component: { template: '<div />' } },
    { path: '/app/reports', component: { template: '<div />' } },
    { path: '/app/settings', component: { template: '<div />' } },
  ],
})

describe('AppSidebar', () => {
  it('renders the LongiPlus logo', async () => {
    await router.push('/app/dashboard')
    const wrapper = mount(AppSidebar, { global: { plugins: [router, createPinia()] } })
    const img = wrapper.find('img[alt="LongiPlus"]')
    expect(img.exists()).toBe(true)
    expect(img.attributes('src')).toBe('/longiplus-logo.svg')
  })

  it('shows the school context', async () => {
    await router.push('/app/dashboard')
    const wrapper = mount(AppSidebar, { global: { plugins: [router, createPinia()] } })
    expect(wrapper.text()).toContain('C.S. Mwinda')
    expect(wrapper.text()).toContain('2026-2027')
  })

  it('shows all nav items', async () => {
    await router.push('/app/dashboard')
    const wrapper = mount(AppSidebar, { global: { plugins: [router, createPinia()] } })
    expect(wrapper.text()).toContain('Tableau de bord')
    expect(wrapper.text()).toContain('Élèves')
    expect(wrapper.text()).toContain('Classes et cours')
    expect(wrapper.text()).toContain('Présences')
    expect(wrapper.text()).toContain('Notes et bulletins')
    expect(wrapper.text()).toContain('Messages')
    expect(wrapper.text()).toContain('Rapports')
  })
})
