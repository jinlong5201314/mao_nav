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
      // 优先尝试加载 public/bookmarks.json
      const response = await fetch('/bookmarks.json', { cache: 'no-store' })
      if (response.ok) {
        const jsonData = await response.json()
        // 检查是否为你的格式
        if (jsonData["收藏夹栏"] && Array.isArray(jsonData["收藏夹栏"])) {
          // 转换为 [{ id, name, sites: [...] }, ...]
          categories.value = jsonData["收藏夹栏"].map((group, idx) => {
            const groupName = Object.keys(group)[0]
            return {
              id: groupName + idx,
              name: groupName,
              icon: "📂", // 可自定义
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
          document.title = title.value
          loading.value = false
          return
        }
      }
    } catch (e) {
      // 忽略，继续用 mockData
    }

    // 默认使用本地mock数据
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
