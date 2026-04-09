import { Router, type IRouter, type Request, type Response } from "express";
import { db, projectsTable, contactSubmissionsTable } from "@workspace/db";
import { eq, desc } from "drizzle-orm";
import {
  AdminCreateProjectBody,
  AdminUpdateProjectBody,
  AdminUpdateProjectParams,
  AdminDeleteProjectParams,
  AdminListProjectsResponse,
  AdminUpdateProjectResponse,
  AdminListContactsResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

function requireAdmin(req: Request, res: Response): string | null {
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) {
    res.status(503).json({ error: "Admin password not configured. Set the ADMIN_PASSWORD environment variable." });
    return null;
  }
  const provided = req.headers["x-admin-password"];
  if (typeof provided !== "string" || provided !== adminPassword) {
    res.status(401).json({ error: "Unauthorized" });
    return null;
  }
  return adminPassword;
}

router.get("/admin/projects", async (req, res): Promise<void> => {
  if (!requireAdmin(req, res)) return;
  const projects = await db
    .select()
    .from(projectsTable)
    .orderBy(desc(projectsTable.featured), desc(projectsTable.createdAt));
  res.json(AdminListProjectsResponse.parse(projects));
});

router.post("/admin/projects", async (req, res): Promise<void> => {
  if (!requireAdmin(req, res)) return;
  const parsed = AdminCreateProjectBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [project] = await db.insert(projectsTable).values(parsed.data).returning();
  req.log.info({ id: project.id }, "Admin created project");
  res.status(201).json(project);
});

router.patch("/admin/projects/:id", async (req, res): Promise<void> => {
  if (!requireAdmin(req, res)) return;
  const params = AdminUpdateProjectParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const parsed = AdminUpdateProjectBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const [project] = await db
    .update(projectsTable)
    .set(parsed.data)
    .where(eq(projectsTable.id, params.data.id))
    .returning();
  if (!project) {
    res.status(404).json({ error: "Project not found" });
    return;
  }
  req.log.info({ id: project.id }, "Admin updated project");
  res.json(AdminUpdateProjectResponse.parse(project));
});

router.delete("/admin/projects/:id", async (req, res): Promise<void> => {
  if (!requireAdmin(req, res)) return;
  const params = AdminDeleteProjectParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const [deleted] = await db
    .delete(projectsTable)
    .where(eq(projectsTable.id, params.data.id))
    .returning();
  if (!deleted) {
    res.status(404).json({ error: "Project not found" });
    return;
  }
  req.log.info({ id: params.data.id }, "Admin deleted project");
  res.sendStatus(204);
});

router.get("/admin/contacts", async (req, res): Promise<void> => {
  if (!requireAdmin(req, res)) return;
  const contacts = await db
    .select()
    .from(contactSubmissionsTable)
    .orderBy(desc(contactSubmissionsTable.createdAt));
  res.json(AdminListContactsResponse.parse(contacts));
});

export default router;
