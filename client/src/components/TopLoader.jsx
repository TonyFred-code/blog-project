import { useEffect, useRef } from "react";
import { useLocation, useNavigation } from "react-router-dom";
import nProgress from "nprogress";
import "nprogress/nprogress.css";

nProgress.configure({
  showSpinner: false,
});

export default function TopLoader() {
  const location = useLocation();
  const prevLocationRef = useRef(location.pathname);
  const isLoadingRef = useRef(false);
  const navigation = useNavigation();

  useEffect(() => {
    if (
      navigation.state !== "idle" &&
      navigation.location?.pathname !== prevLocationRef.current
    ) {
      nProgress.start();
      isLoadingRef.current = true;
    } else if (navigation.state === "idle") {
      if (isLoadingRef.current) {
        nProgress.done();
        isLoadingRef.current = false;
      }

      prevLocationRef.current = location.pathname;
    }
  }, [navigation.state, navigation.location?.pathname, location.pathname]);

  return null;
}
