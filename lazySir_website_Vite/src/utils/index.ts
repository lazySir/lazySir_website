/**
 * @description 获取当前时间对应的提示语
 * @returns {String}
 */
export function getTimeState() {
    let timeNow = new Date();
    let hours = timeNow.getHours();
    if (hours >= 6 && hours <= 10) return `早上好 ⛅`;
    if (hours >= 10 && hours <= 14) return `中午好 🌞`;
    if (hours >= 14 && hours <= 18) return `下午好 🌞`;
    if (hours >= 18 && hours <= 24) return `晚上好 🌛`;
    if (hours >= 0 && hours <= 6) return `凌晨好 🌛`;
}

//获取cookie
export function getCookie(value: string): string | null {
    const cookie = document.cookie
    const match = cookie.match(new RegExp(`${value}=([^;]*)`)) // 使用 RegExp 构造函数
    return match ? match[1] : null
}

// 清空指定名称的 cookie
export function clearCookie(name: string): void {
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
}

// 清空所有 cookie
export function clearAllCookies(): void {
    const cookies = document.cookie.split(';');
    cookies.forEach(cookie => {
        const eqPos = cookie.indexOf('=');
        const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
    });
}

export function setCookie(name: string, value: string, expiresIn: string, path: string = '/'): void {
    const date = new Date();

    // 如果 `expiresIn` 是小时格式，例如 "5h"（5小时）
    const timeValue = parseInt(expiresIn.slice(0, -1)); // 获取数字部分
    const timeUnit = expiresIn.slice(-1); // 获取时间单位部分

    let milliseconds = 0;

    if (timeUnit === 'h') {
        // 小时转换为毫秒数
        milliseconds = timeValue * 60 * 60 * 1000;
    } else if (timeUnit === 'd') {
        // 天数转换为毫秒数
        milliseconds = timeValue * 24 * 60 * 60 * 1000;
    }

    // 计算过期时间
    date.setTime(date.getTime() + milliseconds);
    const expires = `expires=${date.toUTCString()}`;

    // 设置 cookie
    document.cookie = `${name}=${value};${expires};path=${path}`;
}


/**
 * 下载文件工具方法
 * @param {string} relativeUrl - 文件的相对路径
 * @param {string} fileName - 下载的文件名
 */
export const downloadFile = async (relativeUrl: string, fileName: string) => {
    try {
        const serverUrl = import.meta.env.VITE_SERVER_URL
        const fullUrl = `${serverUrl}${relativeUrl}`;
        const response = await fetch(fullUrl);
        if (!response.ok) {
            throw new Error('文件下载失败');
        }
        const blob = await response.blob(); // 获取文件 Blob 数据
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = fileName; // 指定下载文件名
        link.click();

        URL.revokeObjectURL(link.href); // 释放对象 URL
    } catch (error) {
        console.error('文件下载失败:', error);
    }
};


// 根据文件扩展名获取对应的图标，若无匹配则返回默认图标
export function getIconByFileExtension(fileUrl: string): string {
    // 文件类型图标映射
    const icons = {
        doc: 'vscode-icons:file-type-word',
        docx: 'vscode-icons:file-type-word2',
        rtf: 'vscode-icons:file-type-word2',
        xlsx: 'vscode-icons:file-type-excel',
        xls: 'vscode-icons:file-type-excel2',
        pdf: 'vscode-icons:file-type-pdf2',
        txt: 'vscode-icons:file-type-text',
        ppt: 'vscode-icons:file-type-powerpoint',
        pptx: 'vscode-icons:file-type-powerpoint2',
        zip: 'vscode-icons:file-type-zip',
    } as const; // 将 icons 标记为只读，防止修改其键值

    // 正则表达式，获取文件后缀
    const reg = /\.[^.]+$/;
    const result = fileUrl.match(reg);
    const fileExtension = result ? result[0].slice(1).toLowerCase() : ''; // 获取后缀并转换为小写

    // 如果扩展名存在且在 icons 中，则返回对应图标
    if (fileExtension && fileExtension in icons) {
        return icons[fileExtension as keyof typeof icons];
    }

    // 没有匹配的后缀，则返回默认图标
    return 'solar:link-bold';
}


// inspira UI 
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export type ObjectValues<T> = T[keyof T];


/**
 * 动态加载脚本
 * @param {string} src - 脚本 URL
 * * @param {object} option - 配置
 */
export const loadScript = (src: string, option = {}) => {
    if (typeof document === "undefined" || !src) return false;
    // 获取配置
    const { async = false, reload = false, callback } = option as any;
    // 检查是否已经加载过此脚本
    const existingScript = document.querySelector(`script[src="${src}"]`);
    if (existingScript) {
        console.log("已有重复脚本");
        if (!reload) {
            callback && callback(null, existingScript);
            return false;
        }
        existingScript.remove();
    }
    // 创建一个新的script标签并加载
    return new Promise((resolve, reject) => {
        const script = document.createElement("script");
        script.src = src;
        if (async) script.async = true;
        script.onload = () => {
            resolve(script);
            callback && callback(null, script);
        };
        script.onerror = (error) => {
            reject(error);
            callback && callback(error);
        };
        document.head.appendChild(script);
    });
};