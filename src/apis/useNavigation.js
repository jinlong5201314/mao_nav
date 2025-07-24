import { ref } from 'vue'
import { mockData } from '../mock/mock_data.js'

export function useNavigation() {
  const categories = ref([])
  const title = ref('')
  const loading = ref(false)
  const error = ref(null)

  // 新增：尝试从 public/bookmarks.json 读取数据
  const fetchCategories = async () => {
    loading.value = true
    error.value = null

    try {
      // 优先尝试加载 public/bookmarks.json
      const response = await fetch('/bookmarks.json', { cache: 'no-store' })
      if (response.ok) {
        const jsonData = await response.json()
        // 兼容你的 json 格式和 mockData 格式
        if (Array.isArray(jsonData)) {
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
