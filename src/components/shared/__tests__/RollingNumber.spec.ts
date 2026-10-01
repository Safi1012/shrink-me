import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import { nextTick } from 'vue'
import RollingNumber from '../RollingNumber.vue'

// What each digit rolls through, as text, e.g. ['1', '.', '12', '23'] for 1.12 → 1.23
const ribbons = (wrapper: ReturnType<typeof mount>) =>
  Array.from(
    wrapper.find('.inside').element.children,
    (child) =>
      Array.from(child.querySelectorAll('.value'), (value) => value.textContent).join('') ||
      child.textContent
  )

const roll = async (from: number, to: number) => {
  const wrapper = mount(RollingNumber, { props: { value: from } })
  await wrapper.setProps({ value: to })
  await nextTick()
  return wrapper
}

describe('RollingNumber', () => {
  it('groups thousands and keeps the decimals', () => {
    expect(ribbons(mount(RollingNumber, { props: { value: 1234567 } }))).toEqual([
      '1',
      ',',
      '2',
      '3',
      '4',
      ',',
      '5',
      '6',
      '7'
    ])
    expect(ribbons(mount(RollingNumber, { props: { value: 1.25 } }))).toEqual(['1', '.', '2', '5'])
  })

  it('rolls every digit up to its new value', async () => {
    const wrapper = await roll(98, 103)

    expect(wrapper.classes()).toEqual(expect.arrayContaining(['is-up', 'is-rolling']))
    // 98 → 103 carries into the tens (9 → 0) and a new hundreds digit (0 → 1)
    expect(ribbons(wrapper)).toEqual(['01', '90', '890123'])
  })

  it('rolls down from the old value', async () => {
    const wrapper = await roll(103, 98)

    expect(wrapper.classes()).toContain('is-down')
    // Reversed, so the ribbon starts scrolled to the end on the old value and moves back
    expect(ribbons(wrapper)).toEqual(['01', '90', '890123'])
  })

  // 1.13 * 100 is 112.99999999999999 in floating point, which used to end the roll on 1.12
  it('ends the roll on the exact decimals', async () => {
    const wrapper = await roll(1.12, 1.13)

    expect(ribbons(wrapper)).toEqual(['1', '.', '1', '23'])
  })

  it('shows the plain number again once the roll ends', async () => {
    const wrapper = await roll(1.12, 1.13)
    await wrapper.find('.ribbon').trigger('transitionend')

    expect(wrapper.classes()).not.toContain('is-rolling')
    expect(ribbons(wrapper)).toEqual(['1', '.', '1', '3'])
  })
})
