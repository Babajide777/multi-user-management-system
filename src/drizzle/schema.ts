import * as Users from "./tables/Users";
import * as Tasks from "./tables/Tasks";
import * as Tags from "./tables/Tags";
import * as Notifications from "./tables/Notifications";
import * as Comments from "./tables/Comments";

export const schema = {
  ...Users,
  ...Tasks,
  ...Tags,
  ...Notifications,
  ...Comments,
};
