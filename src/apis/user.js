import { request } from "@/utils";

// 登录请求
export function loginApi(formData) {
  return request({
    url: "/authorizations",
    method: "POST",
    data: formData,
  });
}

// 获取用户信息
export function getProfileApi() {
  return request({
    url: "/user/profile",
    method: "GET",
  });
}
