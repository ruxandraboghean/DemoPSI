import { Entity } from "../Entity";

export enum RequestStatus {
  ACCEPTED,
  PENDING,
  DENIED,
}

export class Request {
  public id: string;
  public initiator: Entity;
  public receiver: Entity;
  public status: RequestStatus;
}
