import ACCESS_ENUM from "@/access/ACCESS_ENUM";

/**
 * 检查权限（判断当前用户是否具有某个权限）
 * @param loginUser 当前登录用户
 * @param needAccess 需要的权限，默认值为 ACCESS_ENUM.NOT_LOGIN，也就是不配置此项则表示用户无需登录
 * @return boolean 有无权限
 */
const checkAccess = (loginUser: any, needAccess = ACCESS_ENUM.NOT_LOGIN) => {
  // 获取当前登录用户具有的权限(如果没有 loginUser，则表示未登录)
  const loginUserAccess = loginUser?.userRole ?? ACCESS_ENUM.NOT_LOGIN;
  if (needAccess === ACCESS_ENUM.NOT_LOGIN) {
    return true;
  }
  // 如果用户登录才能访问
  if (needAccess === ACCESS_ENUM.USER) {
    // 用户未登录，返回false
    if (loginUserAccess === ACCESS_ENUM.NOT_LOGIN) {
      return false;
    }
  }
  // 如果需要管理员才能访问
  if (needAccess === ACCESS_ENUM.ADMIN) {
    // 用户不是管理员，返回false
    if (loginUserAccess !== ACCESS_ENUM.ADMIN) {
      return false;
    }
  }
  return true;
};

export default checkAccess;
