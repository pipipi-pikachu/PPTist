import {
  removeIncompleteHtml
} from '@/components/c-md-preview/md';
/**
 * 处理metaData数据，判断是否为JSON字符串并进行合并或赋值
 * @param metaData 原始metaData数据
 * @param newData 需要合并的新数据
 * @returns 处理后的JSON字符串
 */
export const processMetaData = (metaData: any, newData: any = {}): string => {
  let parsedMetaData = {};
  
  // 判断metaData是否为JSON字符串
  if (typeof metaData === 'string') {
    try {
      parsedMetaData = JSON.parse(metaData);
      // 确保解析后是对象
      if (typeof parsedMetaData !== 'object' || parsedMetaData === null || Array.isArray(parsedMetaData)) {
        parsedMetaData = {};
      }
    } catch (e) {
      // 解析失败则使用空对象
      parsedMetaData = {};
    }
  } else if (typeof metaData === 'object' && metaData !== null) {
    // 如果metaData是对象则直接使用
    parsedMetaData = metaData;
  }
  
  // 合并数据
  const mergedData = { ...parsedMetaData, ...newData };
  
  // 返回序列化后的JSON字符串
  return JSON.stringify(mergedData);
};

const escapeRegExp = (string: string): string => {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
};

// 提取 Markdown 中的图片链接
const extractMarkdownImages = (text: string): string[] => {
  // 匹配 ![引用图片](url) 格式开头的图片
  const regex = /!\[引用图片\]\(([^)]+)\)/g;
  const matches = [];
  let match;
  
  while ((match = regex.exec(text)) !== null) {
    matches.push(match[1]); // 图片 URL 在第二个捕获组
  }
  
  return matches;
};
/**
 * 判断字符串是否为有效的JSON对象
 * @param str 待判断的字符串
 * @returns 是否为JSON对象
 */
export const isJsonObject = (str: string): boolean => {
  try {
    const parsed = JSON.parse(str);
    return typeof parsed === 'object' && parsed !== null && !Array.isArray(parsed);
  } catch (e) {
    return false;
  }
};
/**
 * 从数据对象中提取并解析metaData
 * @param data 包含metaData字段的数据对象
 * @returns 解析后的metaData对象，如果解析失败则返回空对象
 */
export const getMetaData = (data: any): any => {
  let metaData: any = {};
  try {
    // 首先检查metaData是否为有效字符串
    if (typeof data?.metaData === 'string' && isJsonObject(data.metaData)) {
      metaData = JSON.parse(data.metaData);
    }
  } catch (error) {
    console.error('处理metaData时出错:', error);
  }
  return metaData;
};
// HTML内容处理函数
export const processHtmlContent = (
  newText = '',
  chunkImages:any= [],
  isStreaming: boolean = true
) => {
  // 立即处理文本，移除不完整的HTML标签
  // 提取md中的图片地址
  // mdImgList.value = newText.match(/!\[.*?\]\((.*?)\)/g)?.map((match: any) => match.match(/\((.*?)\)/)[1]) || [];

  const processedText = removeIncompleteHtml(newText, {
    // 流式阶段允许表格标签不完整，结束后再按原规则清理
    allowIncompleteTable: isStreaming
  });
  
  let updatedText = processedText;
  
  // 提取文本中的图片链接并初始化状态
  const mdImgList = extractMarkdownImages(updatedText);
  // 如果是完整的图片，但是图片地址不存在chunkImages中，直接在updatedText中删除该图片
  mdImgList.forEach((imgUrl:any) => {
    // 图片地址不存在chunkImages中，并且不是im中使用智能体
    if (!chunkImages?.includes(imgUrl)) {
      // 移除src 为imgUrl的完整md格式的图片
      const escapedUrl = escapeRegExp(imgUrl);
      const regex = new RegExp(`!\\[引用图片\\]\\(${escapedUrl}\\)`, 'g');
      updatedText = updatedText.replace(regex, '');
    }
  });
  return updatedText;
};
