import React, { memo } from "react";
import QRCode from "qrcode.react";
import { CSSTransition } from "react-transition-group";
import "./index.less";

type propType = {
  show: boolean;
  onClose: Function;
};

function ShareCode(props: propType) {
  const href = window && window.location.href;
  const { show, onClose } = props;
  const [animate, setAnimate] = React.useState<boolean>(false);

  const changeCanvasToPic = React.useCallback(() => {
    let canvasImg = document.querySelector("#qrId") as HTMLCanvasElement;
    let image = document.querySelector("#codeImage") as HTMLImageElement;
    image.src = canvasImg.toDataURL("image/png");
  }, []);

  React.useEffect(() => {
    setAnimate(show);
    // 渲染的时候
    if (show) {
      const timeout = setTimeout(() => {
        changeCanvasToPic();
        clearTimeout(timeout);
      }, 100);
    }
  }, [show, changeCanvasToPic]);

  return (
    <CSSTransition // 组件名，提供css选择器使用，必填参数，如果缺少了，程序会崩溃报错，注意这个参数带's'
      classNames="fade"
      // 组件是否展示,true为显示
      in={animate}
      // 动画持续时间，需要和css的设置保持一致
      timeout={800}
      // 当in的属性变为false之后，卸载组件，过程可设置动画
      unmountOnExit
    >
      <div className="shareCode">
        <div className="flexCenter">
          <div className="codeBox">
            <QRCode
              id="qrId"
              value={href}
              size={150}
              style={{ display: "none" }}
              renderAs={"canvas"}
            />
            <img id="codeImage" width="150" height="150" src="" alt="" />
          </div>
          <p className="codeDesc">长按保存图片，发送给好友</p>
        </div>

        <div className="close" onClick={() => onClose()}>
          <svg
            className="icon"
            viewBox="0 0 1024 1024"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            p-id="3447"
            width="20"
            height="20"
          >
            <path
              d="M583.168 523.776L958.464 148.48c18.944-18.944 18.944-50.176 0-69.12l-2.048-2.048c-18.944-18.944-50.176-18.944-69.12 0L512 453.12 136.704 77.312c-18.944-18.944-50.176-18.944-69.12 0l-2.048 2.048c-19.456 18.944-19.456 50.176 0 69.12l375.296 375.296L65.536 899.072c-18.944 18.944-18.944 50.176 0 69.12l2.048 2.048c18.944 18.944 50.176 18.944 69.12 0L512 594.944 887.296 970.24c18.944 18.944 50.176 18.944 69.12 0l2.048-2.048c18.944-18.944 18.944-50.176 0-69.12L583.168 523.776z"
              p-id="3448"
              fill="#cdcdcd"
            ></path>
          </svg>
        </div>
      </div>
    </CSSTransition>
  );
}
export default memo(ShareCode);
