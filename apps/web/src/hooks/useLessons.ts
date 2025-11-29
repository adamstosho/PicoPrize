"use client"

import { useState, useEffect, useMemo } from "react"
import { useReadContracts } from "wagmi"
import { 
  PicoPrizePoolABI, 
  getContractAddress,
  formatCUSD,
  type Pool,
  type PoolStatus
} from "@/lib/contracts"
import { 
  type Lesson, 
  type LessonMetadata,
  getLessonMetadata, 
  getDefaultMetadata 
} from "@/lib/lesson-data"

// Convert pool status number to string
function getStatusString(status: PoolStatus): "active" | "closed" | "resolved" | "cancelled" {
  switch (status) {
    case 0: return "active"
    case 1: return "closed"
    case 2: return "resolved"
    case 3: return "cancelled"
    default: return "active"
  }
}

// Convert on-chain pool data to Lesson format
function poolToLesson(pool: Pool, metadata: LessonMetadata): Lesson {
  return {
    id: pool.id.toString(),
    poolId: pool.id,
    title: metadata.title,
    author: metadata.author,
    authorAddress: pool.creator,
    description: metadata.description,
    duration: metadata.duration,
    difficulty: metadata.difficulty,
    tags: metadata.tags,
    image: metadata.image,
    minStake: Number(formatCUSD(pool.minStake)),
    maxStake: Number(formatCUSD(pool.maxStake)),
    totalStaked: Number(formatCUSD(pool.totalStaked)),
    deadline: new Date(Number(pool.deadline) * 1000),
    status: getStatusString(pool.status),
    choicesCount: pool.choicesCount,
    language: metadata.language,
    questions: metadata.questions,
  }
}

export function useLessons(maxPools: number = 20) {
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  // First, get the pool counter to know how many pools exist
  const { data: poolCounter } = useReadContracts({
    contracts: [{
      address: getContractAddress("PICOPRIZE_POOL"),
      abi: PicoPrizePoolABI,
      functionName: "poolCounter",
    }],
  })

  const totalPools = poolCounter?.[0]?.result as bigint | undefined

  // Generate pool IDs to fetch (1 to totalPools, limited by maxPools)
  const poolIds = useMemo(() => {
    if (!totalPools || totalPools === 0n) return []
    const count = Math.min(Number(totalPools), maxPools)
    return Array.from({ length: count }, (_, i) => BigInt(i + 1))
  }, [totalPools, maxPools])

  // Fetch all pools
  const { data: poolsData, isLoading: isPoolsLoading } = useReadContracts({
    contracts: poolIds.map(id => ({
      address: getContractAddress("PICOPRIZE_POOL"),
      abi: PicoPrizePoolABI,
      functionName: "getPool",
      args: [id],
    })),
    query: {
      enabled: poolIds.length > 0,
    },
  })

  // Process pools into lessons
  useEffect(() => {
    let isCancelled = false

    const run = async () => {
      if (isPoolsLoading) {
        setIsLoading(true)
        return
      }

      if (!poolsData) {
        if (!isCancelled) {
          setLessons([])
          setIsLoading(false)
        }
        return
      }

      try {
        const processedLessons: Lesson[] = []

        for (const poolResult of poolsData) {
          if (poolResult.status === "success" && poolResult.result) {
            const pool = poolResult.result as unknown as Pool

            // Skip pools with no creation time (don't exist)
            if (pool.createdAt === 0n) continue

            const idKey = pool.id.toString()
            const uriKey = pool.metadataUri as string

            let metadata: LessonMetadata | null = null

            // 1) Try server-side store by metadataUri and id
            try {
              const primaryKey = uriKey || idKey
              const res = await fetch(`/api/lessons/${encodeURIComponent(primaryKey)}`)
              if (res.ok) {
                metadata = (await res.json()) as LessonMetadata
              } else if (res.status === 404 && uriKey && uriKey !== idKey) {
                // Try secondary key
                const res2 = await fetch(`/api/lessons/${encodeURIComponent(idKey)}`)
                if (res2.ok) {
                  metadata = (await res2.json()) as LessonMetadata
                }
              }
            } catch (err) {
              // Silently fall back to cache/default metadata
            }

            // 2) Fallback to client-side cache or demo/default data
            if (!metadata) {
              metadata =
                getLessonMetadata(idKey) ||
                getLessonMetadata(uriKey) ||
                getDefaultMetadata(idKey, pool.choicesCount)
            }

            processedLessons.push(poolToLesson(pool, metadata))
          }
        }

        // Sort by creation time (newest first)
        processedLessons.sort((a, b) => (b.poolId > a.poolId ? 1 : -1))

        if (!isCancelled) {
          setLessons(processedLessons)
          setError(null)
          setIsLoading(false)
        }
      } catch (err) {
        if (!isCancelled) {
          setError(err as Error)
          setIsLoading(false)
        }
      }
    }

    run()

    return () => {
      isCancelled = true
    }
  }, [poolsData, isPoolsLoading])

  return {
    lessons,
    isLoading,
    error,
    totalPools: totalPools ? Number(totalPools) : 0,
  }
}

// Hook for fetching a single lesson/pool
export function useLesson(poolId: bigint | undefined) {
  const [lesson, setLesson] = useState<Lesson | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const { data: poolData, isLoading: isPoolLoading } = useReadContracts({
    contracts: poolId ? [{
      address: getContractAddress("PICOPRIZE_POOL"),
      abi: PicoPrizePoolABI,
      functionName: "getPool",
      args: [poolId],
    }] : [],
    query: {
      enabled: poolId !== undefined,
    },
  })

  useEffect(() => {
    let isCancelled = false

    const run = async () => {
      if (isPoolLoading) {
        setIsLoading(true)
        return
      }

      if (!poolData || poolData.length === 0 || poolData[0].status !== "success") {
        if (!isCancelled) {
          setLesson(null)
          setIsLoading(false)
        }
        return
      }

      const pool = poolData[0].result as unknown as Pool

      if (pool.createdAt === 0n) {
        if (!isCancelled) {
          setLesson(null)
          setIsLoading(false)
        }
        return
      }

      const idKey = pool.id.toString()
      const uriKey = pool.metadataUri as string
      let metadata: LessonMetadata | null = null

      // 1) Try server-side store
      try {
        const primaryKey = uriKey || idKey
        const res = await fetch(`/api/lessons/${encodeURIComponent(primaryKey)}`)
        if (res.ok) {
          metadata = (await res.json()) as LessonMetadata
        } else if (res.status === 404 && uriKey && uriKey !== idKey) {
          const res2 = await fetch(`/api/lessons/${encodeURIComponent(idKey)}`)
          if (res2.ok) {
            metadata = (await res2.json()) as LessonMetadata
          }
        }
      } catch (err) {
        // Silently fall back to cache/default metadata
      }

      // 2) Fallback
      if (!metadata) {
        metadata =
          getLessonMetadata(idKey) ||
          getLessonMetadata(uriKey) ||
          getDefaultMetadata(idKey, pool.choicesCount)
      }

      if (!isCancelled) {
        setLesson(poolToLesson(pool, metadata))
        setIsLoading(false)
      }
    }

    run()

    return () => {
      isCancelled = true
    }
  }, [poolData, isPoolLoading])

  return { lesson, isLoading }
}

// Hook for active lessons only
export function useActiveLessons(maxPools: number = 20) {
  const { lessons, isLoading, error, totalPools } = useLessons(maxPools)
  
  const activeLessons = useMemo(() => {
    return lessons.filter(lesson => 
      lesson.status === "active" && 
      lesson.deadline > new Date()
    )
  }, [lessons])

  return {
    lessons: activeLessons,
    isLoading,
    error,
    totalPools,
  }
}

