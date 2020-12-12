// https://github.com/validatorjs/validator.js

import isEmail from 'validator/es/lib/isEmail';
import isDate from 'validator/es/lib/isDate';
import isURL from 'validator/es/lib/isURL';
import isEmpty from 'lodash/isEmpty';
import { ValueType, ValidateRule, CustomValidate, ErrorList } from './type';

// `{} / [] / '' / undefined / null` 等内容被认为是空； 0 和 false 被认为是正常数据，部分数据的值就是 0 或者 false
export function isValueEmpty(val: ValueType): boolean {
  return typeof val === 'object'
    ? isEmpty(val)
    : ['', undefined, null].includes(val);
}

/**
 * todo list:
 * - UI 开发结果引入
 * - onReset 和 onSubmit 测试
 * - 单元测试
 * - e2e 测试
 */

/**
 * 为避免引入文件较多，组件仅内置部分校验方法，更多校验业务方自行实现
 */

const VALIDATE_MAP = {
  date: isDate,
  url: isURL,
  email: isEmail,
  required: (val: ValueType): boolean => !isValueEmpty(val),
  boolean: (val: ValueType): boolean => typeof val === 'boolean',
  max: (val: ValueType, num: number): boolean => val.length <= num,
  min: (val: ValueType, num: number): boolean => val.length >= num,
  len: (val: ValueType, num: number): boolean => val.length === num,
  number: (val: ValueType): boolean => !isNaN(val),
  enum: (val: ValueType, strs: Array<string>): boolean => strs.includes(val),
  idcard: (val: ValueType): boolean => /^(\d{18,18}|\d{15,15}|\d{17,17}x)$/i.test(val),
  telnumber: (val: ValueType): boolean => /^1[3456789]d{9}$/.test(val),
  pattern: (val: ValueType, regexp: RegExp): boolean => regexp.test(val),
  // 自定义校验规则，可能是异步校验
  validator: (val: ValueType, validate: CustomValidate): boolean | Promise<boolean> => validate(val),
};

// 校验某一条数据的某一条规则
export function validateOneRule(
  value: ValueType,
  rule: ValidateRule,
): Promise<boolean | ValidateRule> {
  return new Promise((resolve) => {
    let r: boolean | Promise<boolean> = true;
    Object.keys(rule).forEach((key) => {
      // 非必填选项，值为空，返回 true
      if (!rule.required && isValueEmpty(value)) {
        resolve(true);
        return;
      };
      const validateRule = VALIDATE_MAP[key];
      if (validateRule && rule[key]) {
        // rule 值为 true 则表示没有校验参数，只是对值进行默认规则校验
        const options = rule[key] === true ? {} : rule[key];
        r = validateRule(value, options);
        // 校验结果可能是异步 Promise
        if (r instanceof Promise) {
          r.then((result) => {
            resolve(result || rule);
          });
        } else {
          resolve(r || rule);
        }
      }
    });
  });
}

// 全部数据校验
export function validate(value: ValueType, rules: Array<ValidateRule>): Promise<ErrorList> {
  return new Promise((resolve) => {
    const all = rules.map(rule => validateOneRule(value, rule));
    Promise.all(all).then((arr) => {
      const r = arr.filter(item => item !== true) as ErrorList;
      resolve(r);
    });
  });
}
