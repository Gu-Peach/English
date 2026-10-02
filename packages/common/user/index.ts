// 用户相关的共享类型（前后端共用，与 prisma schema 的 User 模型对齐）

// 用户信息（数据库完整形态，含 password，仅后端内部使用）
// 对外返回时一律用 ResultUser / WebResultUser（已剔除 password）
export type User = {
  id: string; // 用户ID
  name: string; // 用户名
  password: string; // 密码（哈希值）
  email?: string | null; // 邮箱
  phone: string; // 手机号
  address?: string | null; // 地址
  avatar?: string | null; // 头像
  wordNumber: number; // 已学习单词数量
  dayNumber: number; // 打卡天数
  createdAt: string; // 创建时间, ISO 日期字符串
  updatedAt: string; // 更新时间, ISO 日期字符串
  lastLoginAt?: string | null; // 最后登录时间, ISO 日期字符串
};

// User                    ← 母类型：数据库里用户的完整形态（含密码）
//  ├─ UserLogin           ← 入参：登录接口 @Body 用
//  ├─ UserRegister        ← 入参：注册接口 @Body 用
//  ├─ ResultUser          ← 出参①：查询用户信息接口返回（无密码）
//  └─ WebResultUser       ← 出参②：登录/注册接口返回（用户信息 + token）

//登录类型
//Pick（摘取类型),从User中提取phone和password字段,返回新类型
export type UserLogin = Pick<User, "phone" | "password">;
//注册
export type UserRegister = Pick<User, "name" | "phone" | "password"> & {
  email?: string; //邮箱（可选，注册表单里会传）
};

//返回的类型（出参），不包含密码
export type ResultUser = Omit<User, "password">;
//token类型
export type Token = {
  accesstoken: string;
  refreshToken: string;
};

//返回的类型，包含token和用户信息
export type WebResultUser = ResultUser & {
  token: Token;
};
