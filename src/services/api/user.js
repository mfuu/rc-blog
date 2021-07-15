import request from "../index"

export const login_user = (query) => 
  request('/user/login', { query })
