// LocalStorage utilities for mock data persistence

export const storage = {
  // A corrupt or wrongly shaped entry (an old version, a hand edit) is dropped and the default used,
  // so one bad key cannot crash the pages that read it.
  get(key, defaultValue = null) {
    let item = null
    try {
      item = window.localStorage.getItem(key)
      if (!item) return defaultValue
      const value = JSON.parse(item)
      const sameShape = defaultValue === null ||
        (Array.isArray(defaultValue) === Array.isArray(value) && typeof value === typeof defaultValue && value !== null)
      if (sameShape) return value
    } catch {
      // fall through: unreadable storage or invalid JSON
    }
    if (item) this.remove(key)
    return defaultValue
  },

  set(key, value) {
    try {
      window.localStorage.setItem(key, JSON.stringify(value))
    } catch (error) {
      console.error(`Error writing to localStorage: ${error}`)
    }
  },

  remove(key) {
    try {
      window.localStorage.removeItem(key)
    } catch (error) {
      console.error(`Error removing from localStorage: ${error}`)
    }
  },

  clear() {
    try {
      window.localStorage.clear()
    } catch (error) {
      console.error(`Error clearing localStorage: ${error}`)
    }
  }
}

