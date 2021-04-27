import React, { ReactPropTypes, useState, memo } from "react";
import { Layout, Menu } from "antd";
import {
  UploadOutlined,
  EditOutlined,
  AppstoreAddOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { hashKey } from "../../methods";
import { Link, HashRouter, withRouter } from "react-router-dom";
import store from "../../store";
import { store_changeSlidercustomIndex } from "../../store/action";
import "./index.less";
const { Sider } = Layout;
interface propsType extends ReactPropTypes {
  collapsed: boolean | undefined;
  location: Location;
}
function SlideCustom(props: any) {
  const meunData = [
    {
      key: hashKey(20),
      icon: <UploadOutlined />,
      text: "上传图片",
      href: "/",
      index: ["1"],
    },
    {
      key: hashKey(20),
      icon: <EditOutlined />,
      text: "图库信息",
      href: "/galleryInfo",
      index: ["2"],
    },
    {
      key: hashKey(20),
      icon: <EditOutlined />,
      text: "轮播头图",
      href: "/slideShow",
      index: ["3"],
    },
    {
      key: hashKey(20),
      icon: <DeleteOutlined />,
      text: "删除图片",
      href: "/editImages",
      index: ["4"],
    },
    {
      key: hashKey(20),
      icon: <AppstoreAddOutlined />,
      text: "待添加功能",
      href: "/undetermined",
      index: ["5"],
    },
  ];

  const returnDefaultIndex = function returnDefaultIndex() {
    let defa: any = meunData.filter((item: any) => {
      return item.href === location.pathname;
    });

    if (!defa[0]) {
      return ["1"];
    }

    return defa[0].index;
  };

  function changeSliderIndex(index: number) {
    const ob = {
      Index: index,
    };
    const action = store_changeSlidercustomIndex(ob);
    store.dispatch(action);
  }

  const { collapsed, location } = props;
  const [defaultSelected] = useState(returnDefaultIndex());

  return (
    <>
      <HashRouter>
        <Sider trigger={null} collapsible collapsed={collapsed}>
          <Menu
            theme="light"
            mode="inline"
            defaultSelectedKeys={defaultSelected}
          >
            {meunData.map((element, index) => {
              return (
                <Menu.Item
                  key={index + 1}
                  icon={element.icon}
                  onClick={() => {
                    changeSliderIndex(index);
                  }}
                >
                  {element.text}
                  <Link to={element.href}></Link>
                </Menu.Item>
              );
            })}
          </Menu>
        </Sider>
      </HashRouter>
    </>
  );
}
export default memo(withRouter(SlideCustom));
