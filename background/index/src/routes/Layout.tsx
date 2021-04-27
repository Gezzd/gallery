import React, { ReactPropTypes } from "react";
import { renderRoutes } from "react-router-config";
interface propsType extends ReactPropTypes { route: any; }
const Layout = ({ route }: any) => <>{renderRoutes(route.routes)}</>;

export default Layout;
