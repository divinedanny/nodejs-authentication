import { Express, Request, Response } from "express";
import { createUserHandler } from "./controller/user.controller";
import validateRequest from "./middleware/validateRequest";
import { CreateUserSchema } from "./schema/user.schema";
import { createSessionHandler, deleteSessionHandler, getUserSessionHandler } from "./controller/session.controller";
import { CreateSessionSchema } from "./schema/session.schema";
import requireUser from "./middleware/requireUser";

function routes(app: Express) {
    app.get("/healthcheck", (req: Request, res: Response) => res.sendStatus(200));
    app.post("/api/users", validateRequest(CreateUserSchema), createUserHandler);
    app.post("/api/sessions", validateRequest(CreateSessionSchema), createSessionHandler);
    app.get("/api/sessions", requireUser, getUserSessionHandler);
    app.delete("/api/sessions", requireUser, deleteSessionHandler);
}

export default routes;