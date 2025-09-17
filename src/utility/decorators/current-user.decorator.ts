import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUser = createParamDecorator(
  <T>(data: never, ctx: ExecutionContext): T | undefined => {
    const request = ctx.switchToHttp().getRequest<{ currentUser?: T }>();
    return request.currentUser;
  },
);
