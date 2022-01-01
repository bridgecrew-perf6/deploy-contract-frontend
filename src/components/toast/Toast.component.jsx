import cogoToast from "cogo-toast";

class Toaster {
  success = message => {
    let options = { position: "top-right", heading: "Success" };
    cogoToast.success(message, options);
  };

  error = message => {
    let options = { position: "top-right", heading: "Error" };
    cogoToast.error(JSON.stringify(message), options);
  };

  info = message => {
    let options = { position: "top-right", heading: "Info" };
    cogoToast.info(message, options);
  };
}

export const toast = new Toaster();
