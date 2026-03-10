// ============================================================
// /api/projects — Projects CRUD
// GET: List user's projects
// POST: Create new project
// ============================================================

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { projects } from "@/lib/db/schema";
import { eq, isNull, desc } from "drizzle-orm";
import { getSessionUser, unauthorizedResponse } from "@/lib/auth-utils";

export async function GET() {
  try {
    const user = await getSessionUser();
    if (!user) return unauthorizedResponse();

    const userProjects = await db.query.projects.findMany({
      where: eq(projects.userId, user.id),
      orderBy: desc(projects.updatedAt),
    });

    // Filter out soft-deleted
    const active = userProjects.filter((p) => !p.deletedAt);

    return NextResponse.json(active);
  } catch (error) {
    console.error("[projects GET] Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch projects" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getSessionUser();
    if (!user) return unauthorizedResponse();

    const body = await request.json();
    const { name, url, description, githubRepo } = body;

    if (!name || !url) {
      return NextResponse.json(
        { error: "Name and URL are required" },
        { status: 400 }
      );
    }

    const [project] = await db
      .insert(projects)
      .values({
        userId: user.id,
        name,
        url,
        description: description ?? null,
        githubRepo: githubRepo ?? null,
      })
      .returning();

    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    console.error("[projects POST] Error:", error);
    return NextResponse.json(
      { error: "Failed to create project" },
      { status: 500 }
    );
  }
}
