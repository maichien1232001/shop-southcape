import { ThemeConfig } from 'antd';

export const customTheme: ThemeConfig = {
  token: {
    borderRadius: 8,
    fontFamily: 'var(--font-family)',
    controlHeight: 38,
  },
  components: {
    Button: {
      controlHeight: 38,
      borderRadius: 6,
      fontFamily: 'var(--font-family)',
    },
    Input: {
      controlHeight: 38,
      borderRadius: 6,
    },
    Select: {
      controlHeight: 38,
      borderRadius: 6,
    },
    DatePicker: {
      controlHeight: 38,
      borderRadius: 6,
    },
    InputNumber: {
      controlHeight: 38,
      borderRadius: 6,
    }
  }
};
