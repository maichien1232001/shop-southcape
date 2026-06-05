import moment from 'moment-timezone';

export const DEFAULT_TIMEZONE = 'Asia/Ho_Chi_Minh';

// Thiết lập timezone mặc định cho moment trong toàn dự án
moment.tz.setDefault(DEFAULT_TIMEZONE);

export default moment;
