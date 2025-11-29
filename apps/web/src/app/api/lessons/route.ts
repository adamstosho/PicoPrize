import { NextRequest, NextResponse } from "next/server"
import fs from "fs/promises"
import path from "path"
import type { LessonMetadata } from "@/lib/lesson-data"

type Store = Record<string, LessonMetadata>

const DATA_DIR = path.join(process.cwd(), "data")
const STORE_PATH = path.join(DATA_DIR, "lessons.json")

async function ensureStore(): Promise<Store> {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true })
    const raw = await fs.readFile(STORE_PATH, "utf8")
    return raw ? (JSON.parse(raw) as Store) : {}
  } catch (err: any) {
    if (err.code === "ENOENT") {
      return {}
    }
    console.error("Error reading lessons store:", err)
    return {}
  }
}

async function saveStore(store: Store) {
  await fs.mkdir(DATA_DIR, { recursive: true })
  await fs.writeFile(STORE_PATH, JSON.stringify(store, null, 2), "utf8")
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { id, metadata, aliases } = body as {
      id?: string
      metadata: LessonMetadata
      aliases?: string[]
    }

    if (!metadata || typeof metadata !== "object") {
      return NextResponse.json({ error: "Invalid metadata" }, { status: 400 })
    }

    const primaryId = id && typeof id === "string" ? id : `lesson-${Date.now()}`

    const store = await ensureStore()
    store[primaryId] = metadata

    if (Array.isArray(aliases)) {
      for (const alias of aliases) {
        if (alias && typeof alias === "string") {
          store[alias] = metadata
        }
      }
    }

    await saveStore(store)

    return NextResponse.json({ id: primaryId })
  } catch (err) {
    console.error("Error saving lesson metadata:", err)
    return NextResponse.json({ error: "Failed to save metadata" }, { status: 500 })
  }
}


