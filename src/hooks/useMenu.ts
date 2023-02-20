import { computed } from 'vue'
import { navConfigs } from '@/configs/nav.config'
import compact from 'lodash/compact'

export const useMenus = (currentRole = '') => {
  const hideOnNav = ['settings']
  const essentialLinks = computed(() => {
    return compact(
      navConfigs
        .filter((item) => !hideOnNav.includes(item.name))
        .map((item) => {
          const isRenderItem = item.groups.includes(currentRole)
          const children = item?.children ?? []
          const renderChildren = children.filter((child: AnyObject) =>
            child.groups.includes(currentRole)
          )
          return isRenderItem
            ? {
                ...item,
                children: renderChildren,
              }
            : null
        })
    )
  })

  return {
    essentialLinks,
  }
}
