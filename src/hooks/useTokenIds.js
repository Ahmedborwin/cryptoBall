import { useEffect, useState } from "react"

const useTokenIds = (tokenCounter) => {
  const [tokenIds, setTokenIds] = useState([])

  useEffect(() => {
    if (tokenCounter) {
      const ids = Array.from({ length: tokenCounter }, (_, i) => i)
      setTokenIds(ids)
    }
  }, [tokenCounter])

  return [...tokenIds]
}

export default useTokenIds
