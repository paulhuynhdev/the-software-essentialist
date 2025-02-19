import { MarketingService } from "../../../modules/marketing/marketingService";
import { PostsService } from "../../../modules/posts/postsService";
import { UsersService } from "../../../modules/users/usersService";

export interface Application {
  user: UsersService;
  post: PostsService;
  marketing: MarketingService;
}
