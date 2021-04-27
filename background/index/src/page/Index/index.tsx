import React, { useState, useEffect, memo } from "react";
import UploadImages from "../../components/uploadImages";
import asyncData from "../../asyncData";
import "./index.less";
import { connect } from "react-redux";
function Index({ history, galleryStatus }: any) {

  let [allowUploadStatus, setAllowUploadStatus] = useState({
    select: false,
    status: "",
    requestFunc: asyncData.galleryImage,
  });

  useEffect(() => {
    if (!galleryStatus) {
      return () => {};
    }
    const status = Object.assign(allowUploadStatus, galleryStatus);
    setAllowUploadStatus(status);
    return () => {};
  }, [allowUploadStatus, galleryStatus]);

  return (
    <div>
      <UploadImages allowUploadStatus={allowUploadStatus} />
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

export default memo(connect(mapStateToProps, mapDispatchToProps)(Index));
