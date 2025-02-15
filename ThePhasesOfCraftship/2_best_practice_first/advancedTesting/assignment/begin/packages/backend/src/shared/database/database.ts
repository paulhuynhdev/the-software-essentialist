import { PrismaClient } from "@prisma/client";
import { Post } from "@dddforum/shared/src/api/posts";
import { ServerErrorException } from "../exceptions";
export class Database {
  private connection: PrismaClient;

  constructor() {
    this.connection = new PrismaClient();
  }

  getConnection() {
    return this.connection;
  }

  async connect() {
    await this.connection.$connect();
  }

  private async findPosts(_: string): Promise<Post[]> {
    try {
      const posts = await this.connection.post.findMany({
        orderBy: { dateCreated: "desc" },
      });
      const formattedPosts = posts.map(this.formatPost);

      return formattedPosts;
    } catch (error) {
      throw new ServerErrorException();
    }
  }

  private formatPost(post: any): Post {
    return {
      id: post.id,
      memberId: post.memberId,
      postType: post.postType,
      title: post.title,
      content: post.content,
      dateCreated: post.dateCreated.toISOString(),
    };
  }
}
