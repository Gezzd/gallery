import React, { useState, useEffect, createElement, memo } from "react";
import { CSSTransition } from "react-transition-group";
import SliderCustom from "./components/sliderCustom";
import { Layout, Button, message, Modal, Radio } from "antd";
import { MenuUnfoldOutlined, MenuFoldOutlined } from "@ant-design/icons";
import asyncData from "./asyncData";
import methods from "./methods";
import { store_changeGallery } from "./store/action";
import { connect } from "react-redux";
import { renderRoutes } from "react-router-config";
import { HashRouter } from "react-router-dom";
import routes from "./routes";
import "./App.less";

const { Header, Content } = Layout;
const { hashKey } = methods;
const { innerHeight } = window;

function App(props: any) {
  const [collapsed, setCollapsed] = useState(false);
  const [currentGallerySelected, setCurrentGallerySelected] = useState(false);
  const [galleryData, setGalleryData] = useState<Array<any>>([]);
  const [visible, setVisible] = useState(false);
  const [showChooseGallery, setShowChooseGallery] = useState(true);
  const [currentGallery, setCurrentGallery] = useState("你还未选择图库");
  const { set_store_changeGallery } = props;
  function toggle() {
    let coll: boolean = collapsed;
    setCollapsed(!coll);
  }

  function showModal() {
    setVisible(true);
  }

  function cancelModel() {
    setVisible(false);
  }

  function hidenChooseGallery() {
    setShowChooseGallery(false);
  }

  async function getAllGallery() {
    try {
      let allGallery: any = await asyncData.getAllGalleryData();
      allGallery = (allGallery && allGallery.data) || [];
      return allGallery;
    } catch (error) {
      throw error;
    }
  }

  // 筛选出图库里面包含了的规定id的下标对象
  function returnIncluendsIndex(arr: any[], sign: string): any[] {
    return arr.filter((item: any) => {
      return item["sign"] === sign;
    });
  }

  // 选择哪个图库
  function changeGallery(e: any) {
    const currentGalleryStatus = e.target.value;
    let name = returnIncluendsIndex(galleryData, e.target.value)[0]["name"];
    setCurrentGallerySelected(true);
    setCurrentGallery(name);
    // 存入redux的对象
    const ob = {
      status: currentGalleryStatus,
      name: name,
      select: true,
    };

    set_store_changeGallery(ob);
  }

  useEffect(() => {
    // 获取有哪些图库
    (async () => {
      try {
        let data = await getAllGallery();
        setGalleryData(data);
      } catch (error) {
        message.error("网络异常,请刷新页面!");
        throw error;
      }
    })();
  }, []);

  return (
    <div className="App">
      <CSSTransition
        // 组件名，提供css选择器使用，必填参数，如果缺少了，程序会崩溃报错，注意这个参数带's'
        classNames="fade"
        // 组件是否展示,true为显示
        in={showChooseGallery}
        // 动画持续时间，需要和css的设置保持一致
        timeout={800}
        // 当in的属性变为false之后，卸载组件，过程可设置动画
        unmountOnExit
      >
        <Layout
          style={{
            width: "100%",
            minHeight: "100vh",
            position: "fixed",
            top: "0",
            left: "0",
            zIndex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{ fontSize: "28px", fontWeight: 600, padding: "0 0 40px 0" }}
          >
            请选择现有图库
          </div>
          <Radio.Group
            name="whichOfTheGallery"
            onChange={(e) => {
              changeGallery(e);
              hidenChooseGallery();
            }}
          >
            {galleryData.map((gallery: any) => {
              return (
                <Radio
                  value={gallery["sign"]}
                  style={{ margin: "8px" }}
                  key={hashKey(10)}
                >
                  {gallery["name"]}
                </Radio>
              );
            })}
          </Radio.Group>
        </Layout>
      </CSSTransition>

      <Layout style={{ minHeight: "100vh" }}>
        <Modal
          title="现已有图库"
          visible={visible}
          footer={null}
          onCancel={cancelModel}
        >
          <Radio.Group
            name="whichOfTheGallery"
            onChange={(e) => {
              changeGallery(e);
              cancelModel();
            }}
          >
            {galleryData.map((gallery: any) => {
              return (
                <Radio
                  value={gallery["sign"]}
                  style={{ margin: "8px" }}
                  key={hashKey(10)}
                >
                  {gallery["name"]}
                </Radio>
              );
            })}
          </Radio.Group>
        </Modal>

        <HashRouter>
          <SliderCustom collapsed={collapsed} />
        </HashRouter>

        <Layout className="site-layout">
          <Header
            className="site-layout-background site-layout-layout"
            style={{ padding: "0 10px" }}
          >
            {createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
              className: "trigger",
              onClick: toggle,
            })}
            <div>
              <Button
                type="primary"
                danger={!currentGallerySelected}
                onClick={showModal}
              >
                点我选择图片库
              </Button>
              <Button type="text">当前图库是:{currentGallery}</Button>
            </div>
          </Header>

          <Content
            className="site-layout-background"
            style={{
              margin: "24px 16px",
              padding: 24,
              overflow: "auto",
              height: innerHeight - 64,
            }}
          >
            <HashRouter>{renderRoutes(routes)}</HashRouter>
          </Content>
        </Layout>
      </Layout>
    </div>
  );
}

function mapStateToProps(state: any) {
  return {
    galleryName: state.galleryStatus && state.galleryStatus.name,
  };
}

function mapDispatchToProps(dispath: Function) {
  return {
    set_store_changeGallery(ob: any) {
      dispath(store_changeGallery(ob));
    },
  };
}
export default memo(connect(mapStateToProps, mapDispatchToProps)(App));
