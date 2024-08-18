import Router from "koa-router";
import { AppServer } from "./server/server";
import jwt from "koa-jwt";

const router = new Router();

AppServer.initServer();

AppServer.addRoute(
  router.get("/public", async (ctx) => {
    ctx.status = 200;
    ctx.body = {
      nodeVersion: process.version,
      service: "TypeScriptNode",
      memory: process.memoryUsage(),
      pid: process.pid,
      uptime: process.uptime(),
      environment: "dev",
      appVersionPackage: "1.0.0",
    };
  }),
);

AppServer.addRoute(
  router.get("/private", jwt({ secret: "shared-secret" }), async (ctx) => {
    ctx.status = 200;
    ctx.body = {
      nodeVersion: process.version,
      service: "TypeScriptNode-Private",
      memory: process.memoryUsage(),
      pid: process.pid,
      uptime: process.uptime(),
      environment: "dev",
      appVersionPackage: "1.0.0",
    };
  }),
);
