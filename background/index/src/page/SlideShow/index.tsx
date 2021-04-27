import React, { useCallback, useEffect, memo } from "react";
import { Upload, message, Modal } from "antd";
import "./index.less";
import asyncData from "../../asyncData";
import store from "../../store";
import { PlusOutlined } from "@ant-design/icons";
import { hashKey } from "../../methods";
import { connect } from "react-redux";

interface uploadImageProp {
  uid: string;
  index: number;
  name: string;
  status: string;
  url: object | any;
}

function SlideShow({ galleryStatus }: any) {
  const MaxSize = React.useMemo(() => {
    return 1024 * 1024 * 5;
  }, []);

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

  // function getBase64(file: File) {
  //   return new Promise((resolve, reject) => {
  //     const reader = new FileReader();
  //     reader.readAsDataURL(file);
  //     reader.onload = () => resolve(reader.result);
  //     reader.onerror = (error) => reject(error);
  //   });
  // }

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>上传头图</div>
    </div>
  );

  const {
    setSlideImage,
    getMaxSlideNumber,
    getSlideImage,
    deleteSlideImage,
  } = asyncData;
  let newState: any = store.getState();
  let originalGalleryStatus: any | undefined = newState.galleryStatus; // 组件刚创建时候的图库状态
  const [maxSlidesCount, setMaxSlidesCount] = React.useState(1);
  const [slides, setSlides]: any = React.useState([]);
  const [allowUploadStatus, setAllowUploadStatus] = React.useState(
    originalGalleryStatus
  );

  const [modal, contextHolder] = Modal.useModal();

  const uploadProps = {
    name: "image",
    accept: "image/*",
    async customRequest(info: any) {
      const form = new FormData();
      form.append("status", String(allowUploadStatus.status));
      form.append("image", info.file);
      form.append("id", hashKey(16));
      try {
        let result: any = await setSlideImage(form, info.onProgress);
        if (result && result.code === 1) {
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
    fileList: slides,
    beforeUpload(info: any) {
      if (!allowUploadStatus || !allowUploadStatus.select) {
        message.error("你还未选择图库呢 亲");
        return false;
      }
      const { size } = info;
      if (comparison(size, MaxSize)) {
        message.error("图片不得大于5M");
        return false;
      }
      return true;
    },
    onChange({ fileList }: any) {
      setSlides(fileList);
    },
    onRemove(info: any) {
      console.log(slides);
      console.log(info);
    },
    // onPreview={this.handlePreview}
    // onChange={this.handleChange},
  };

  const openModal = useCallback(() => {
    return new Promise((reslove) => {
      modal.confirm({
        content: <>确定删除这张头图吗?</>,
        okText: "是的",
        cancelText: "不了",
        onOk() {
          reslove(true);
        },
        onCancel() {
          reslove(false);
        },
      });
    });
  }, [modal]);

  useEffect(() => {
    // 设置数据请求回来的轮播图
    async function setAlerySlideImages(requestData: object) {
      try {
        let alerySlideImages: any = await getSlideImage(requestData);
        if (!alerySlideImages) {
          message.error("图片加载失败, 刷新下页面再试试!");
          return null;
        }

        let imgs: Array<object> = JSON.parse(alerySlideImages.data) || [];
        imgs = imgs.map((item, index) => {
          const ob: uploadImageProp = {
            index,
            uid: hashKey(20),
            name: hashKey(20),
            status: "done",
            url: item,
          };
          return ob;
        });
        setSlides(imgs);
      } catch (error) {
        if (error.message === "cancel") return;
        message.error("轮播图加载失败, 刷新下页面再试试!");
      }
    }

    // 设置可以上传的轮播图的最大数
    async function setMaxSlideNumber(requestData: object) {
      try {
        const maxSlideNumber: any = await getMaxSlideNumber(requestData);
        let { code, data } = maxSlideNumber;
        if (code !== 1) {
          message.error("轮播图最大图数加载失败！");
          return;
        }
        data = Number(data);
        setMaxSlidesCount(data);
      } catch (error) {
        if (error.message === "cancel") return;
        message.error("网络错误!");
      }
    }

    if (!galleryStatus || !galleryStatus.status) {
      message.error("你还未选择图库呢 亲");
      return () => {};
    }

    setAllowUploadStatus(galleryStatus);
    setMaxSlideNumber({ sign: galleryStatus.status });
    setAlerySlideImages({ status: galleryStatus.status });
    // 销毁函数
    return () => window.requestCancel("cancel");
  }, [getMaxSlideNumber, getSlideImage, galleryStatus]);

  return (
    <div className="slideShow">
      <div className="item-Title">首页轮播图</div>
      <div style={{ width: "100%", padding: "20px 0 0 0" }}>
        <Upload
          {...uploadProps}
          listType="picture-card"
          onRemove={async (info: any) => {
            const { index } = info;
            const res: boolean | any = await openModal();
            if (res === true) {
              try {
                await deleteSlideImage({
                  index,
                  status: String(allowUploadStatus.status),
                });
              } catch (error) {}
            }
            return res;
          }}
        >
          {slides.length >= maxSlidesCount ? null : uploadButton}
        </Upload>
        {contextHolder}
      </div>
    </div>
  );
}
function mapStateToProps(state: any) {
  return {
    galleryStatus: state.galleryStatus,
  };
}
function mapDispatchToProps(dispatch: Function) {
  return {};
}
export default memo(connect(mapStateToProps, mapDispatchToProps)(SlideShow));
