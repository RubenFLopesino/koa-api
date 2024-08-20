import Router from "koa-router";
import { UserService } from "./user.service";
import { User } from "./user.document";
import jwt from "jsonwebtoken";

export class UserController {
  private static readonly baseURL = "/users/";

  private static readonly router = new Router();

  private static generateRoutes() {
    this.router.post(`${this.baseURL}register`, async (ctx) => {
      try {
        ctx.status = 201;
        ctx.body = await UserService.register(ctx.request.body as User);
      } catch (error) {
        throw error;
      }
    });

    this.router.post(`${this.baseURL}login`, async (ctx) => {
      try {
        const result = await UserService.login(
          ctx.request.body as { email: string; password: string },
        );

        ctx.status = result ? 401 : 200;

        ctx.body = result
          ? {
              token: jwt.sign(
                JSON.stringify({
                  email: result.email,
                  role: result.role,
                }),
                process.env["SECRET_KEY"] as string,
              ),
              message: "Successfully logged in!",
            }
          : {
              error: 401,
              message: "Not Authorized",
            };
      } catch (error) {
        throw error;
      }
    });

    this.router.patch(`${this.baseURL}verify`, async (ctx) => {
      try {
        const result = await UserService.verify(
          ctx.query["verificationCode"] as string,
        );
        ctx.status = result ? 200 : 404;
        ctx.body = result ?? {
          message: "There is no user with this verification code",
        };
      } catch (error) {
        throw error;
      }
    });
  }

  static get routes(): Router.IMiddleware {
    this.generateRoutes();
    return this.router.routes();
  }
}
