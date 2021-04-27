import React from "react";
import { Redirect } from "react-router-dom";
import loadable from '@loadable/component';
const Index = loadable(() => import("../page/Index"));
const HomeLayout = loadable(() => import("../routes/Layout"));
const GalleryInfo = loadable(() => import("../page/GalleryInfo"));
const SlideShow = loadable(() => import("../page/SlideShow"));
const EditImages = loadable(() => import("../page/EditImages"));
const ChooseGallery = loadable(() => import("../page/ChooseGallery"));

export default [
  {
    path: "/",
    component: HomeLayout,
    routes: [
      {
        path: "/",
        exact: true,
        render: () => <Redirect to={"/index"} />,
      },
      {
        key: "Index",
        path: "/index",
        component: Index,
        exact: true,
        routes: [],
      },
      {
        key: "GalleryInfo",
        path: "/galleryInfo",
        component: GalleryInfo,
        exact: true,
        routes: [],
      },
      {
        key: "SlideShow",
        path: "/slideShow",
        component: SlideShow,
        exact: true,
        routes: [],
      },
      {
        key: "EditImages",
        path: "/editImages",
        component: EditImages,
        exact: true,
        routes: [],
      },
      {
        key: "ChooseGallery",
        path: "/chooseGallery",
        component: ChooseGallery,
        exact: true,
        routes: [],
      },
    ],
  },
];
