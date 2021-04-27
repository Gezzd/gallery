import React, { memo, useState, useEffect } from "react";
import "./index.less";
import {
  getGalleryInfo,
  setGalleryInfo as setGalleryDataRequest,
} from "../../asyncData";
import { Input, Button, message, DatePicker, TimePicker } from "antd";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import moment from "moment";
import { hashKey } from "../../methods";
const { TextArea } = Input;

type infoType = {
  name: string;
  address: string;
  galleryDescribe: string;
  holdingTime: string;
  holdingDate: string;
};
function GalleryInfo(props: any) {
  const { sign, allow } = props;
  const [galleryInfo, setGalleryInfo] = useState<infoType>({
    name: "",
    address: "",
    galleryDescribe: "",
    holdingDate: "2021-01-01",
    holdingTime: "00:00:00",
  });

  function commitDesc() {
    if (!sign) {
      message.error("亲 你还未选择图库呢");
      return;
    }

    (async () => {
      try {
        const {
          name,
          address,
          galleryDescribe,
          holdingDate,
          holdingTime,
        } = galleryInfo;

        let requestData = {
          name,
          address,
          galleryDescribe,
          holdingTime: `${holdingDate} ${holdingTime}`,
        };

        const formData = new FormData();
        formData.append("status", sign);
        formData.append("info", JSON.stringify(requestData));
        let res: ReturnType<any> = await setGalleryDataRequest(formData);
        if (res["code"] === 1) {
          message.success("活动图库信息已修改。");
        } else {
          message.error("修改出错了, 再试试提交一回吧。");
        }
      } catch (error) {}
    })();
  }

  useEffect(() => {
    if (!allow) {
      message.error("你还未选择图库呢 亲");
      return () => {};
    }

    async function getInfo() {
      if (!sign) {
        return null;
      }
      try {
        let desc = await getGalleryInfo({ status: sign });
        return desc;
      } catch (error) {
        if (error) {
          return null;
        }
      }
    }

    async function setInfo() {
      try {
        const infoData: any = await getInfo();
 
        if (!infoData) {
          message.error("图片的描述加载失败, 刷新下页面再试试!");
          return null;
        }

        const { data } = infoData;
        if (!data) return;

        const { address, name, galleryDescribe } = data;

        // 正则表达取日期与时间
        const dateRegexp = /\d{4}(-)(1[0-2]|0?\d)\1([0-2]\d|\d|30|31)/;
        const timeRegxp = /(?:[01]\d|2[0-3]):[0-5]\d:[0-5]\d/;

        const holdingDate = data.holdingTime.match(dateRegexp)[0];
        const holdingTime = data.holdingTime.match(timeRegxp)[0];

        const ob = {
          holdingDate,
          holdingTime,
          address,
          name,
          galleryDescribe,
        };

        setGalleryInfo(ob);
      } catch (error) {
        if (error.message === "cancel") return;
        message.error("图片的描述加载失败, 刷新下页面再试试!");
      }
    }
    // 生成组件
    setInfo();
    return () => {
      window.requestCancel("cancel");
    };
  }, [sign, allow]);

  return (
    <>
      <h1 style={{ clear: "both", margin: "1.6rem 0 1rem" }}>活动标题</h1>
      <Input
        placeholder="✎在这填写活动名称"
        key={hashKey(20)}
        defaultValue={galleryInfo.name}
        onChange={(e) => {
          e.persist();
          setGalleryInfo((preState) => {
            preState.name = e.target.value;
            return preState;
          });
        }}
      />

      <h1 style={{ clear: "both", margin: "1.6rem 0 1rem" }}>现场地址</h1>
      <Input
        placeholder="✎在这填写现场地址"
        key={hashKey(20)}
        defaultValue={galleryInfo.address}
        onChange={(e) => {
          e.persist();
          setGalleryInfo((preState) => {
            preState.address = e.target.value;
            return preState;
          });
        }}
      />

      <h1 style={{ clear: "both", margin: "1.6rem 0 1rem" }}>活动开幕时间</h1>
      <DatePicker
        key={hashKey(20)}
        defaultValue={moment(galleryInfo.holdingDate, "YYYY-MM-DD")}
        onChange={(date, dateString) => {
          setGalleryInfo((preState) => {
            preState.holdingDate = dateString;
            return preState;
          });
        }}
      />
      <TimePicker
        key={hashKey(20)}
        defaultValue={moment(galleryInfo.holdingTime, "HH:mm:ss")}
        onChange={(time, timeString) => {
          setGalleryInfo((preState) => {
            preState.holdingTime = timeString;
            return preState;
          });
        }}
      />

      <h1 style={{ clear: "both", margin: "1.6rem 0 1rem" }}>活动描述</h1>
      <TextArea
        key={hashKey(20)}
        defaultValue={galleryInfo.galleryDescribe}
        onChange={(e) => {
          setGalleryInfo((preState) => {
            preState.galleryDescribe = e.target.value;
            return preState;
          });
        }}
        placeholder="✎在这填写对应图库的描述"
        autoSize={{ minRows: 6 }}
        maxLength={100}
      />
      <div
        style={{
          padding: "20px 0 0 0",
          margin: "0 auto",
        }}
      />
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <Button type={"primary"} onClick={commitDesc}>
          确定
        </Button>
      </div>
    </>
  );
}

function mapStateToProps(state: any) {
  return {
    sign: state.galleryStatus && state.galleryStatus.status,
    allow: state.galleryStatus && state.galleryStatus.select,
  };
}

function mapDispatchToProps(dispatch: Function) {
  return {};
}

export default memo(
  connect(mapStateToProps, mapDispatchToProps)(withRouter(GalleryInfo))
);
