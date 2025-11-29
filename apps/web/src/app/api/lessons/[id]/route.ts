import { NextRequest, NextResponse } from "next/server"
import fs from "fs/promises"
import path from "path"
import type { LessonMetadata } from "@/lib/lesson-data"

type Store = Record<string, LessonMetadata>

const DATA_DIR = path.join(process.cwd(), "data")
const STORE_PATH = path.join(DATA_DIR, "lessons.json")

async function loadStore(): Promise<Store> {
  try {
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

export async function GET(
  _req: NextRequest,
  context: { params: { id: string } }
) {
  const { id } = context.params

  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 })
  }

  const store = await loadStore()
  const metadata = store[id]

  if (!metadata) {
    return NextResponse.json({ error: "Not found" }, { status: 404 })
  }

  return NextResponse.json(metadata)
}


