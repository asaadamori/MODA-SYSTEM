import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import dataSourceOptions from 'db/data-source';
import { CurrentUserMiddleware } from './utility/middleware/current-user.middleware';
import { CategoriesModule } from './categories/categories.module';

@Module({
  imports: [UsersModule, TypeOrmModule.forRoot(dataSourceOptions), CategoriesModule],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(CurrentUserMiddleware)
      .forRoutes({ path: '*path', method: RequestMethod.ALL });
  }
}
