import React, { useEffect } from "react";

export const useConfirmBeforeUnload = (needsToBeSaved: boolean) => {
  const handleBeforeUnload = (event: BeforeUnloadEvent) => {
    if (needsToBeSaved) {
      // Cancel the event as stated by the standard.
      event.preventDefault();
      // Chrome requires returnValue to be set.
      event.returnValue = "";
    }
  };

  useEffect(() => {
    window.addEventListener("beforeunload", handleBeforeUnload);

    // Remove the event listener when the component is unmounted
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [needsToBeSaved]);
};
