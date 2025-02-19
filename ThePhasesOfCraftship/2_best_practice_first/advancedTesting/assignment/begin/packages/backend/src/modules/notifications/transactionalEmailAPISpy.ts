import { Spy } from "@dddforum/shared/testDoubles/spy";
import { TransactionalEmailAPI } from "./transactionalEmailAPI";

export class TransactionalEmailAPISpy
  extends Spy<TransactionalEmailAPI>
  implements TransactionalEmailAPI
{
  private static instance: TransactionalEmailAPISpy | null = null;

  constructor() {
    super();
  }

  static getInstance() {
    if (TransactionalEmailAPISpy.instance) {
      return TransactionalEmailAPISpy.instance;
    }
    TransactionalEmailAPISpy.instance = new TransactionalEmailAPISpy();
    return TransactionalEmailAPISpy.instance;
  }

  sendMail(input: {
    to: string;
    subject: string;
    text: string;
  }): Promise<boolean> {
    this.addCall("sendMail", [input]);

    return Promise.resolve(true);
  }

  async reset() {
    this.calls = [];
  }
}
