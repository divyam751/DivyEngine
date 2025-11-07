import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { Bounce, ToastContainer, toast } from "react-toastify";

const EngineToast = () => {
  const { toastStatus, toastMessage, toastTrigger } = useSelector(
    (state) => state.toast
  );

  useEffect(() => {
    if (!toastStatus || !toastMessage) return;
    toast[toastStatus](toastMessage, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
      transition: Bounce,
    });
  }, [toastTrigger, toastMessage, toastStatus]);
  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        transition={Bounce}
      />
    </>
  );
};

export default EngineToast;
