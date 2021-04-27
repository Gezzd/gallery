import React from "react";
import { Upload, message } from "antd";
import { InboxOutlined } from "@ant-design/icons";
import "./index.less";

const { Dragger } = Upload;
const MaxSize = 1024 * 1024 * 10;
/**
 * @description: 数字大小比较 第一参数是否大于第二个参数 是返回Ture 反之亦然
 * @param { arg1 number, arg2 number }
 * @return: boolean
 */
function comparison(arg1: number, arg2: number) {
  const Max = Math.max(arg1, arg2);
  let result = Max === arg1 ? true : false;
  return result;
}

interface porpsInterface {
  // select?: boolean;
  // status: string;
  // requestFunc: any;
  allowUploadStatus: {
    select?: boolean;
    status: string;
    requestFunc: any;
  };
}
function UploadImages(props: porpsInterface) {
  let draggerProps = {
    name: "image",
    accept: "image/*",
    multiple: true,
    customRequest: async (info: any) => {
      const form = new FormData();
      form.append("status", String(props.allowUploadStatus.status));
      form.append("image", info.file);
      try {
        let result: any = await props.allowUploadStatus.requestFunc(form, info.onProgress);
        if (result && result.code === "1") {
          info.onSuccess(result, info.file);
          message.success(`${info.file.name} 图片上传成功了.`);
        } else {
          info.onError();
          message.error(`${info.file.name} 图片上传失败了.`);
        }
      } catch (error) {
        message.error("网络出错了,再试一下");
        info.onError();
        throw error;
      }
    },
    beforeUpload(info: any) {
      if (!props.allowUploadStatus.status) {
        message.error("你还未选择图库呢 亲");
        return false;
      }
      const { size } = info;
      if (comparison(size, MaxSize)) {
        message.error("图片不得大于10M");
        return false;
      }
      return true;
    },
    onChange(info: any) {
      // const { status } = info.file;
      // if (status !== "uploading") {
      //   console.log(info.file, info.fileList);
      // }
      // if (status === "done") {
      //   message.success(`${info.file.name} 图片上传成功了.`);
      // } else if (status === "error") {
      //   message.error(`${info.file.name} 图片失败了.`);
      // }
    },
  };

  return (
    <Dragger {...draggerProps}>
      <p className="ant-upload-drag-icon">
        <InboxOutlined />
      </p>
      <p className="ant-upload-text">
        Click or drag image to this area to upload
      </p>
      <p className="ant-upload-hint">
        Support for a single or bulk upload. Strictly prohibit from uploading
        company data or other band files
      </p>
    </Dragger>
  );
}
export default React.memo(UploadImages);
