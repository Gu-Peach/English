import { serverApi, type Response } from "..";
import type { CourseList } from "@en/common/course";

export const getCourseList = () =>
  serverApi.get("/course/list") as Promise<Response<CourseList>>;
//获取我购买的课程
export const getMyCourse = () =>
  serverApi.get("/course/my") as Promise<Response<CourseList>>;
