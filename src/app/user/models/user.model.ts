export interface User {
  displayName: string;
  name: string;
  iconUrl: string | null;
  mail: string;
  uid: string; //FIXME: UUID;
}
