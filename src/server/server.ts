import Application from "koa";
import koa from "koa";
import { Server } from "http";
import bodyParser from "koa-bodyparser";
import cors from "koa2-cors";
import Router from "koa-router";
import jwt from "koa-jwt";

export class AppServer {
  private static _app: Application;

  static initServer(): Server {
    // custom 401 handling
    this.app.use(async (ctx, next) => {
      try {
        await next();
      } catch (error) {
        if (error.status === 401) {
          ctx.status = 401;
          ctx.body = {
            error: 401,
            message: "Not Authorized",
          };
        } else {
          throw error;
        }
      }
    });
    this.useMiddleware(cors());
    this.useMiddleware(bodyParser());
    return this.app.listen(process.env["PORT"], async () => {
      console.log(`Listening on ${process.env["PORT"]}`);
    });
  }

  static useMiddleware(middleware: Application.Middleware) {
    this.app.use(middleware);
  }

  static addRoute(router: Router): void {
    this.app.use(router.routes());
  }

  static get secureRoute(): jwt.Middleware {
    return jwt({ secret: process.env["SECRET_KEY"] as string });
  }

  private static get app(): Application {
    if (this._app) {
      return this._app;
    }
    this._app = new koa();
    return this._app;
  }
}
