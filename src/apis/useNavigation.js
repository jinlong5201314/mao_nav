import { ref } from 'vue'
import { mockData } from '../mock/mock_data.js'

export function useNavigation() {
  const categories = ref([])
  const title = ref('')
  const loading = ref(false)
  const error = ref(null)

  const fetchCategories = async () => {
    loading.value = true
    error.value = null

    try {
      const response = await fetch('/bookmarks.json', { cache: 'no-store' })
      if (response.ok) {
        const jsonData = await response.json()
        // 1. 处理你的自定义格式
        if (jsonData["收藏夹栏"] && Array.isArray(jsonData["收藏夹栏"])) {
          categories.value = jsonData["收藏夹栏"].map((group, idx) => {
            const groupName = Object.keys(group)[0]
            return {
              id: groupName + idx,
              name: groupName,
              icon: "📁",
              order: idx,
              sites: group[groupName].map((item, siteIdx) => ({
                id: groupName + "-" + siteIdx,
                name: item.name,
                url: item.href,
                description: "",
                icon: item.icon
              }))
            }
          })
          title.value = '我的收藏夹'
        // 2. 兼容原格式
        } else if (Array.isArray(jsonData)) {
          categories.value = jsonData
          title.value = '我的收藏夹'
        } else if (jsonData.categories) {
          categories.value = jsonData.categories
          title.value = jsonData.title || '猫猫导航'
        }
        document.title = title.value
        loading.value = false
        return
      }
    } catch (e) {
      // 忽略错误
    }

    // 回退到 mockData
    categories.value = mockData.categories
    title.value = mockData.title
    document.title = title.value
    loading.value = false
  }

  return {
    categories,
    title,
    loading,
    error,
    fetchCategories
  }
}
