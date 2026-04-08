import { Router, type IRouter } from "express";
import { db, projectsTable } from "@workspace/db";
import { desc } from "drizzle-orm";
import { ListProjectsResponse } from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/projects", async (req, res): Promise<void> => {
  const projects = await db
    .select()
    .from(projectsTable)
    .orderBy(desc(projectsTable.featured), desc(projectsTable.createdAt));

  req.log.info({ count: projects.length }, "Projects fetched");
  res.json(ListProjectsResponse.parse(projects));
});

export default router;
