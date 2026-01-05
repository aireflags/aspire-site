'use client'

import { useEffect } from 'react'

export default function FontLinks() {
  useEffect(() => {
    // 检查是否已经添加了字体链接
    const existingLink = document.querySelector('link[href*="Material+Symbols+Outlined"]')
    
    if (!existingLink) {
      const link = document.createElement('link')
      link.rel = 'stylesheet'
      link.href = 'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200'
      document.head.appendChild(link)
    }
  }, [])

  return null
}


