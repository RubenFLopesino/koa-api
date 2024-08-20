import Application from "koa";
import koa from "koa";
import { Server } from "http";
import bodyParser from "koa-bodyparser";
import cors from "koa2-cors";
import jwt from "koa-jwt";
import { UserController } from "../routes/users/user.controller";

export class AppServer {
  private static _app: Application;

  static initServer(): Server {
    this.app.use(async (ctx, next) => {
      try {
        await next();
      } catch (error) {
        switch (error.status) {
          case 401:
            ctx.body = {
              error: 401,
              message: "Not Authorized",
            };
            break;
          default:
            ctx.status = 500;
            ctx.body = {
              error: 500,
              message: error.message,
            };
            break;
        }
      }
    });
    this.useMiddleware(cors());
    this.useMiddleware(bodyParser());
    this.useControllers();
    return this.app.listen(process.env["PORT"], async () => {
      console.log(`Listening on ${process.env["PORT"]}`);
    });
  }

  static useMiddleware(middleware: Application.Middleware) {
    this.app.use(middleware);
  }

  private static useControllers(): void {
    this.app.use(UserController.routes);
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
