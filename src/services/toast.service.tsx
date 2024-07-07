import type { ToastOptions } from "material-react-toastify";
import { toast } from "material-react-toastify";

import CustomToast from "../components/informational/CustomToast";

const DEFAULT_AUTOCLOSE = 5000; // 5 seconds display
const toastBaseConfig: ToastOptions = {
  position: "top-right",
  autoClose: DEFAULT_AUTOCLOSE,
  hideProgressBar: false,
  closeOnClick: false,
  pauseOnHover: true,
  draggable: true,
  pauseOnFocusLoss: true,
  closeButton: true,
};

export function displayError(title: string, message: string, link?: string, linkLabel?: string, toastId?: string) {
  if (toastId && toast.isActive(toastId)) return;

  toast.error(<CustomToast title={title} message={message} link={link} linkLabel={linkLabel} />, {
    ...toastBaseConfig,
    toastId,
  });
}

export function displaySuccess(title: string, message: string, link?: string, linkLabel?: string) {
  toast.success(<CustomToast title={title} message={message} link={link} linkLabel={linkLabel} />, {
    ...toastBaseConfig,
  });
}

export function displayWarning(
  title: string | undefined,
  message: any,
  toastId: string,
  link?: string,
  linkLabel?: string
) {
  toast.warning(<CustomToast title={title} message={message} link={link} linkLabel={linkLabel} />, {
    ...toastBaseConfig,
    autoClose: false,
    toastId,
  });
}
// Display an info toast, will be sticky & updated once receive an update toast
export function displayInfo(title: string, message: string, toastId: string, link?: string, linkLabel?: string) {
  toast.dark(<CustomToast title={title} message={message} link={link} linkLabel={linkLabel} loading />, {
    ...toastBaseConfig,
    autoClose: false,
    toastId,
  });
}

export function updateToastWarningText(
  newTitle: string | undefined,
  newMessage: any,
  toastId: string,
  newLink?: string,
  newLinkLabel?: string
) {
  const isToastActive = toast.isActive(toastId);
  if (isToastActive) {
    toast.update(toastId, {
      render: <CustomToast title={newTitle} message={newMessage} link={newLink} linkLabel={newLinkLabel} loading />,
    });
  } else {
    displayWarning(newTitle, newMessage, toastId, newLink, newLinkLabel);
  }
}

export function updateToastInfosText(
  newTitle: string,
  newMessage: string,
  toastId: string,
  newLink?: string,
  newLinkLabel?: string
) {
  const isToastActive = toast.isActive(toastId);
  if (isToastActive) {
    toast.update(toastId, {
      render: <CustomToast title={newTitle} message={newMessage} link={newLink} linkLabel={newLinkLabel} loading />,
    });
  } else {
    displayInfo(newTitle, newMessage, toastId, newLink, newLinkLabel);
  }
}

export function updateToastInfosToSuccess(
  newTitle: string,
  newMessage: string,
  toastId: string,
  newLink?: string,
  newLinkLabel?: string
) {
  const isToastActive = toast.isActive(toastId);
  if (isToastActive) {
    toast.update(toastId, {
      type: "success",
      render: <CustomToast title={newTitle} message={newMessage} link={newLink} linkLabel={newLinkLabel} />,
      autoClose: DEFAULT_AUTOCLOSE,
    });
  } else {
    displaySuccess(newTitle, newMessage, newLink, newLinkLabel);
  }
}

export function updateToastInfosToError(
  newTitle: string,
  newMessage: string,
  toastId: string,
  newLink?: string,
  newLinkLabel?: string
) {
  const isToastActive = toast.isActive(toastId);
  if (isToastActive) {
    toast.update(toastId, {
      type: "error",
      render: <CustomToast title={newTitle} message={newMessage} link={newLink} linkLabel={newLinkLabel} />,
      autoClose: DEFAULT_AUTOCLOSE,
    });
  } else {
    displayError(newTitle, newMessage, newLink, newLinkLabel);
  }
}
