export const dva = {
  config: {
    onError(err) {
      err.preventDefault();
      console.error(err.message);
    },
  },
};

// 自定义 render，比如在 render 前做权限校验
export function render(oldRender) {
    console.log("1111111111111");
    oldRender();
}

