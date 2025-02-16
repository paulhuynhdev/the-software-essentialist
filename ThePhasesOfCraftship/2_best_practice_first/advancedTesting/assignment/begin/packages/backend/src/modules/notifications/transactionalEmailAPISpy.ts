import { Spy } from "@dddforum/shared/testDoubles/spy";
import { TransactionalEmailAPI } from "./transactionalEmailAPI";

export class TransactionalEmailAPISpy
  extends Spy<TransactionalEmailAPI>
  implements TransactionalEmailAPI
{
  constructor() {
    super();
  }

  sendMail(input: {
    to: string;
    subject: string;
    text: string;
  }): Promise<boolean> {
    this.addCall("sendMail", [input]);

    return Promise.resolve(true);
  }
}
