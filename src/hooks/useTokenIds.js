import { useEffect, useState } from "react"

const useTokenIds = (tokenCounter) => {
  const [tokenIds, setTokenIds] = useState([])

  useEffect(() => {
    if (tokenCounter) {
      const ids = Array.from({ length: tokenCounter.toNumber() }, (_, i) => i)
      setTokenIds(ids)
    }
  }, [tokenCounter])
}

export default useTokenIds
