import { useMemo } from "react";
import { Style, Avatar as AvatarDiceBear } from "@dicebear/core";
import lorelei from "@dicebear/styles/lorelei.json" with { type: "json" };
import { AvatarImage } from "./ui/avatar";

const style = new Style(lorelei);

export default function UserAvatar({
  seed = "alice",
  alt = "",
  className = "",
}) {
  const avatar = useMemo(() => {
    return new AvatarDiceBear(style, {
      seed,
      size: 128,
    }).toDataUri();
  }, [seed]);

  return <AvatarImage src={avatar} alt={alt} className={className} />;
}
