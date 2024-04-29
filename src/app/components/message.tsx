import React, { useEffect } from "react";
import Swal from "sweetalert2";

const MessagePopup = ({ message, onClose }) => {
  useEffect(() => {
    let timerInterval; // Initialize timerInterval variable

    Swal.fire({
      title: "Successfully signed out!",
      html: `You will be redirected to the Home screen in <b></b> milliseconds.`,
      timer: 3000,
      timerProgressBar: true,
      didOpen: () => {
        Swal.showLoading();
        const timer = Swal.getPopup().querySelector("b");
        timerInterval = setInterval(() => {
          timer.textContent = `${Swal.getTimerLeft()}`;
        }, 100);
      },
      willClose: () => {
        clearInterval(timerInterval);
        onClose(); // Close the popup when the alert is closed
      },
    });

    return () => clearInterval(timerInterval); // Clear the interval on unmount
  }, [onClose]); // Re-run effect when onClose changes

  return null; // Return null because the popup will be displayed by SweetAlert2
};

export default MessagePopup;
